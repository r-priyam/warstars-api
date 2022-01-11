import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { Repository } from 'typeorm';
import { ChildLeague, Division, League, LeagueAdmin } from '~/database';

@Injectable()
export class CoreService {
	constructor(
		@InjectRepository(League) private leagueDb: Repository<League>,
		@InjectRepository(ChildLeague) private childLeagueDb: Repository<ChildLeague>,
		@InjectRepository(Division) private divisionDb: Repository<Division>,
		@InjectRepository(LeagueAdmin) private adminDb: Repository<LeagueAdmin>,
		@OgmaLogger(CoreService) private readonly logger: OgmaService,
		private readonly jwtService: JwtService
	) {}

	public async getLeagueInfo(leagueId: number) {
		try {
			const data = await this.leagueDb
				.createQueryBuilder('league')
				.where('league.league_id = :leagueId', { leagueId: leagueId })
				.getOne();
			return data;
		} catch (error) {
			this.logger.error(error);
			throw new HttpException('Soemething went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public async getChildLeagueInfo(childLeagueId: number) {
		try {
			const data = await this.childLeagueDb
				.createQueryBuilder('child')
				.where('child.id = :childLeagueId', { childLeagueId: childLeagueId })
				.getOne();
			return data;
		} catch (error) {
			this.logger.error(error);
			throw new HttpException('Soemething went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public async getUserLeagues(discordId: string) {
		const leagueDataQueryString = `SELECT t1.*,
                t2.season_id, t2.specific_id, t2.start_time, t2.end_time, t2.is_active AS season_active,
                COUNT(t3) AS total_admins
                FROM league t1 LEFT JOIN league_season t2 ON t1.league_id = t2.league_id AND 
                t2.is_active = (SELECT is_active FROM league_season WHERE league_id = $1 ORDER BY is_active DESC LIMIT 1) 
                INNER JOIN super_admin t3 ON t1.league_id = t3.league_id 
                WHERE t1.league_id = $1 GROUP BY t1.league_id, t2.season_id`;

		const childDataQueryString = `SELECT t1.*,
                t2.season_id, t2.specific_id, t2.start_time, t2.end_time, t2.is_active AS season_active,
                COUNT(t3) AS total_admins 
                FROM child_league t1 LEFT JOIN league_season t2 ON t1.league_id = t2.league_id AND 
                t2.is_active = (SELECT is_active FROM league_season WHERE league_id = $1 ORDER BY is_active DESC LIMIT 1) 
                INNER JOIN league_admin t3 ON t1.league_id = t3.league_id 
                WHERE t1.league_id = $1 GROUP BY t1.league_id, t2.season_id`;

		const divisionDataQueryString = `SELECT t1.*, COUNT(t2.*) AS clans_count FROM division t1 LEFT JOIN league_clan t2 ON t1.id = 
                t2.division_id AND t1.season_id = t2.child_season_id WHERE t1.child_id = $1 AND t1.season_id = $2 GROUP BY 
                t1.id, t2.division_id`;

		const data = await this.adminDb
			.createQueryBuilder('user')
			.where('user.discord_id = :discordId', { discordId: discordId })
			.getMany();
		if (data) {
			const userLeagues = [];
			for (const league of data) {
				const leagueData = await this.leagueDb.query(leagueDataQueryString, [league.leagueId]);
				const child = await this.childLeagueDb
					.createQueryBuilder('child')
					.where('child.league_id = :leagueId', { leagueId: league.leagueId })
					.getMany();
				if (child) {
					const _childData = [];
					for (const childData of child) {
						const childLeagueData = await this.childLeagueDb.query(childDataQueryString, [childData.id]);
						childLeagueData.divisions = await this.divisionDb.query(divisionDataQueryString, [
							childLeagueData.id,
							childLeagueData.season_id
						]);
						_childData.push(childLeagueData);
					}
					leagueData.child_leagues = _childData;
				} else {
					leagueData.child_leagues = [];
				}
				userLeagues.push(leagueData);
			}
		}
	}

	public async getUserLeaguePermissions(discordId: string) {
		try {
			const data = await this.adminDb
				.createQueryBuilder('user')
				.where('user.discord_id = :discordId', { discordId: discordId })
				.getMany();

			const payload = {};
			data.forEach((x) => (payload[x.leagueId] = x.permissions));
			return this.jwtService.sign(payload);
		} catch (error) {
			this.logger.error(error);
			throw new HttpException('Soemething went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
