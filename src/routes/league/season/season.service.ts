import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { OgmaService } from '@ogma/nestjs-module';
import { OgmaLogger } from '@ogma/nestjs-module';
import type { Repository } from 'typeorm';
import type { ClashService } from '~/core/clash/clash.service';
import { ChildLeagueSeason, LeagueClan, LeagueSeason } from '~/database';
import type {
    IEndChildSeason,
    IEndLeagueSeason,
    INewChildLeagueSeason,
    INewLeagueSeason,
    ISeasonAddClan,
    ISeasonRemoveClan
} from '~/utils/interfaces';

@Injectable()
export class SeasonService {
    constructor(
        @InjectRepository(LeagueClan) private leagueClanDb: Repository<LeagueClan>,
        @InjectRepository(LeagueSeason) private leagueSeasonDb: Repository<LeagueSeason>,
        @InjectRepository(ChildLeagueSeason) private childSeasonDb: Repository<ChildLeagueSeason>,
        @OgmaLogger(SeasonService) private readonly logger: OgmaService,
        private readonly clash: ClashService
    ) {}

    private coc = this.clash.clashClient;

    public async seasonInfo(seasonId: number) {
        return await this.leagueSeasonDb.createQueryBuilder('season').where('season.season_id = :seasonId', { seasonId }).getOne();
    }

    public async childSeasonInfo(seasonId: number) {
        return await this.childSeasonDb.createQueryBuilder('childSeason').where('childSeason.season_id = :seasonId', { seasonId }).getOne();
    }

    public async getChildSeasonClans(childId: number, seasonId: number) {
        return await this.leagueClanDb
            .createQueryBuilder('clan')
            .where('clan.child_id = :childId AND clan.child_season_id = seasonId', { childId, seasonId })
            .getMany();
    }

    public async newLeagueSeason(data: INewLeagueSeason) {
        const check = await this.childSeasonDb.query(
            'SELECT EXISTS(SELECT 1 FROM league_season WHERE league_id = $1 AND is_active = True)',
            [data.leagueId]
        );

        if (check)
            throw new HttpException('One season is active at the moment. Please end it first to start new season', HttpStatus.BAD_REQUEST);

        const nextId = await this.leagueSeasonDb
            .createQueryBuilder('season')
            .where('season.league_id = :leagueId', { leagueId: data.leagueId })
            .getCount();
        data.specificId = nextId;

        try {
            await this.leagueSeasonDb
                .createQueryBuilder()
                .insert()
                .values([
                    {
                        leagueId: data.leagueId,
                        specificId: data.specificId,
                        startTime: new Date(data.startTime),
                        endTime: new Date(data.endTime),
                        isActive: true
                    }
                ])
                .execute();
        } catch (error) {
            this.logger.printError(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (data.childData.length > 0) {
            for (const childId in data.childData) {
                const childSeasonData: INewChildLeagueSeason = {
                    leagueId: data.leagueId,
                    childLeagueId: parseInt(childId, 10),
                    startTime: data.startTime,
                    endTime: data.endTime,
                    isActive: true
                };
                await this.newChildSeason(childSeasonData);
            }
        }
    }

    public async newChildSeason(data: INewChildLeagueSeason) {
        const check = await this.childSeasonDb.query(
            'SELECT EXISTS(SELECT 1 FROM child_league_season WHERE child_league_id = $1 AND is_active = True)',
            [data.childLeagueId]
        );

        if (check)
            throw new HttpException('One season is active at the moment. Please end it first to start new season', HttpStatus.BAD_REQUEST);

        const nextId = await this.childSeasonDb
            .createQueryBuilder('season')
            .where('season.child_league_id = :childLeagueId', { childLeagueId: data.childLeagueId })
            .getCount();
        data.specificId = nextId;

        try {
            await this.childSeasonDb
                .createQueryBuilder()
                .insert()
                .values([
                    {
                        leagueSeasonId: data.leagueSeasonId ?? 0,
                        leagueId: data.leagueId,
                        childLeagueId: data.childLeagueId,
                        specificId: data.specificId,
                        startTime: new Date(data.startTime),
                        endTime: new Date(data.endTime),
                        isActive: true
                    }
                ])
                .execute();
        } catch (error) {
            this.logger.printError(error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async endLeagueSeason(data: IEndLeagueSeason) {
        return await this.leagueSeasonDb.query('UPDATE league_season SET is_active=False WHERE season_id = $1 AND league_id = $2', [
            data.seasonId,
            data.leagueId
        ]);
    }

    public async endChildSeason(data: IEndChildSeason) {
        return await this.childSeasonDb.query(
            'UPDATE child_league_season SET is_active=False WHERE season_id = $1 AND child_league_id = $2',
            [data.seasonId, data.childLeagueId]
        );
    }

    public async addSeasonClans(data: ISeasonAddClan) {
        const clanData = {};
        for (const tag of data.clanTags) {
            try {
                const clan = await this.coc.getClan(tag);
                clanData[clan.tag] = clan.name;
            } catch (error) {
                if (error.reason === 'notFound') throw new HttpException('Clan Not Found!', HttpStatus.NOT_FOUND);
                else {
                    this.logger.error(error);
                    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        }

        if (data.clanTags.length === 1) {
            try {
                return await this.leagueClanDb
                    .createQueryBuilder()
                    .insert()
                    .values([
                        {
                            leagueId: data.leagueId,
                            childId: data.childId,
                            divisionId: data.divisionId || 0,
                            leagueSeasonId: data.leagueSeasonId,
                            childSeasonId: data.childSeasonId,
                            name: clanData[data.clanTags[0]],
                            tag: data.clanTags[0]
                        }
                    ])
                    .execute();
            } catch (error) {
                if (error.code === '23505') {
                    throw new HttpException('Clan tag is already registered for season', HttpStatus.BAD_REQUEST);
                } else {
                    this.logger.error(error);
                    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        }

        for (const tag in data.clanTags) {
            await this.leagueClanDb
                .createQueryBuilder()
                .insert()
                .values([
                    {
                        leagueId: data.leagueId,
                        childId: data.childId,
                        divisionId: data.divisionId || 0,
                        leagueSeasonId: data.leagueSeasonId,
                        childSeasonId: data.childSeasonId,
                        name: clanData[tag],
                        tag
                    }
                ])
                .orIgnore()
                .execute();
        }
    }

    public async removeSeasonClan(data: ISeasonRemoveClan) {
        try {
            await this.leagueClanDb.query('DELETE FROM league_clan WHERE child_id = $1 AND child_season_id = $2 AND tag = $3', [
                data.childId,
                data.childSeasonId,
                data.tag
            ]);
        } catch (error) {
            this.logger.error(error);
            throw new HttpException('Soemething went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
