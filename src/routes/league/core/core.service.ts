/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { Connection, Repository } from 'typeorm';
import { ChildLeague, League, LeagueAdmin } from '~/database';

@Injectable()
export class CoreService {
    constructor(
        @InjectRepository(League) private leagueDb: Repository<League>,
        @InjectRepository(ChildLeague) private childLeagueDb: Repository<ChildLeague>,
        @InjectRepository(LeagueAdmin) private adminDb: Repository<LeagueAdmin>,
        @OgmaLogger(CoreService) private readonly logger: OgmaService,
        @InjectConnection() private readonly db: Connection,
        private readonly jwtService: JwtService
    ) {}

    public async getLeagueInfo(leagueId: number) {
        return await this.leagueDb.createQueryBuilder('league').where('league.league_id = :leagueId', { leagueId }).getOne();
    }

    public async getChildLeagueInfo(childLeagueId: number) {
        return await this.childLeagueDb.createQueryBuilder('child').where('child.id = :childLeagueId', { childLeagueId }).getOne();
    }

    public async getUserLeagues(discordId: string) {
        const leagueDataQueryString = `SELECT t1.league_id AS "leagueId", t1.name, t1.abbreviation, t1.head_admin AS "headAdmin", t1.discord_id AS "discordId", t1.icon_url AS "iconUrl", t1.discord_invite AS "discordInvite", t1.twitter_handle AS "twitterHandle", t1.website, t1.rules, t1.description, t1.is_verified AS "isVerified", t1.registered_on AS "registerdOn",
                t2.season_id AS "seasonId", t2.specific_id AS "specificId", t2.start_time AS "startTime", t2.end_time AS "endTime", t2.is_active AS "seasonActive",
                COUNT(t3) AS "totalAdmins" 
                FROM league t1 LEFT JOIN league_season t2 ON t1.league_id = t2.league_id AND 
                t2.is_active = (SELECT is_active FROM league_season WHERE league_id = $1 ORDER BY is_active DESC LIMIT 1) 
                INNER JOIN league_admin t3 ON t1.league_id = t3.league_id 
                WHERE t1.league_id = $1 GROUP BY t1.league_id, t2.season_id`;

        const childDataQueryString = `SELECT t1.id, t1.league_id AS "leagueId", t1.name, t1.abbreviation, t1.icon_url AS "iconUrl",
		t2.season_id AS "seasonId", t2.specific_id AS "specificId", t2.start_time AS "startTime", t2.end_time AS "endTime", t2.is_active AS "seasonActive",
                COUNT(t3) AS "totalAdmins" 
                FROM child_league t1 LEFT JOIN league_season t2 ON t1.league_id = t2.league_id AND 
                t2.is_active = (SELECT is_active FROM league_season WHERE league_id = $1 ORDER BY is_active DESC LIMIT 1) 
                INNER JOIN league_admin t3 ON t1.league_id = t3.league_id 
                WHERE t1.league_id = $1 GROUP BY t1.league_id, t2.season_id`;

        const divisionDataQueryString = `SELECT t1.id, t1.league_id AS "leagueId", t1.season_id AS "seasonId", t1.name, t1.abbreviation, t1.icon_url AS "iconUrl",
				COUNT(t2.*) AS "clansCount" 
				FROM division t1 LEFT JOIN league_clan t2 ON t1.id = 
                t2.division_id AND t1.season_id = t2.child_season_id WHERE t1.child_id = $1 AND t1.season_id = $2 GROUP BY 
                t1.id, t2.division_id`;

        const data = await this.adminDb.createQueryBuilder('user').where('user.discord_id = :discordId', { discordId }).getMany();
        if (data) {
            const userLeagues = [];
            for (const league of data) {
                const leagueData = await this.db.query(leagueDataQueryString, [league.leagueId]);
                const child = await this.childLeagueDb
                    .createQueryBuilder('child')
                    .where('child.league_id = :leagueId', { leagueId: league.leagueId })
                    .getMany();
                if (child) {
                    const _childData = [];
                    for (const childData of child) {
                        const childLeagueData = await this.db.query(childDataQueryString, [childData.id]);
                        childLeagueData[0].divisions = await this.db.query(divisionDataQueryString, [
                            childLeagueData.id,
                            childLeagueData.season_id
                        ]);
                        _childData.push(...childLeagueData);
                    }
                    leagueData[0].childLeagues = _childData;
                } else {
                    leagueData[0].childLeagues = [];
                }
                userLeagues.push(...leagueData);
            }
            return userLeagues;
        }
    }

    public async getUserLeaguePermission(discordId: string, leagueId: number) {
        return await this.adminDb
            .createQueryBuilder('user')
            .where('user.discord_id = :discordId AND user.league_id = :leagueId', {
                discordId,
                leagueId
            })
            .getOne();
    }

    public async getUserLeaguePermissions(discordId: string) {
        const data = await this.adminDb.createQueryBuilder('user').where('user.discord_id = :discordId', { discordId }).getMany();
        const payload = {};
        data.forEach((league) => (payload[league.leagueId] = league.permissions));
        return this.jwtService.sign({ ...payload });
    }
}
