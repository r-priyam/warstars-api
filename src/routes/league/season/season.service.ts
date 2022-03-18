import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ClashService } from '~/core/clash/clash.service';
import { ChildLeagueSeason, LeagueClan, LeagueSeason } from '~/database';
import { EVENT_VALUES } from '~/utils/Constants';
import {
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
        private readonly clash: ClashService,
        private readonly eventEmitter: EventEmitter2
    ) {}

    private coc = this.clash.clashClient;

    public async seasonInfo(seasonId: number) {
        await this.leagueSeasonDb.createQueryBuilder('season').where('season.season_id = :seasonId', { seasonId }).getOne();
    }

    public async childSeasonInfo(seasonId: number) {
        return await this.childSeasonDb.createQueryBuilder('childSeason').where('childSeason.season_id = :seasonId', { seasonId }).getOne();
    }

    public async getSeasonChildClans(childId: number, seasonId: number) {
        return await this.leagueClanDb
            .createQueryBuilder('clan')
            .where('clan.child_id = :childId AND clan.child_season_id = :seasonId', { childId, seasonId })
            .getMany();
    }

    public async newLeagueSeason(data: INewLeagueSeason) {
        const check = await this.childSeasonDb.query(
            'SELECT EXISTS(SELECT 1 FROM league_season WHERE league_id = $1 AND is_active = True)',
            [data.leagueId]
        );

        if (check[0].exists) {
            throw new HttpException('One season is active at the moment. Please end it first to start new season', HttpStatus.BAD_REQUEST);
        }

        data.specificId = await this.leagueSeasonDb
            .createQueryBuilder('season')
            .where('season.league_id = :leagueId', { leagueId: data.leagueId })
            .getCount();

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

        // TODO: cross check
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

        if (check[0].exists) {
            throw new HttpException('One season is active at the moment. Please end it first to start new season', HttpStatus.BAD_REQUEST);
        }

        data.specificId = await this.childSeasonDb
            .createQueryBuilder('season')
            .where('season.child_league_id = :childLeagueId', { childLeagueId: data.childLeagueId })
            .getCount();

        const newSeasonData = await this.childSeasonDb
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
        this.eventEmitter.emit(EVENT_VALUES.UPDATE_CACHE_CHILD_SEASON_INFO, newSeasonData.generatedMaps[0].seasonId);
    }

    public async endLeagueSeason(data: IEndLeagueSeason) {
        return await this.leagueSeasonDb.query('UPDATE league_season SET is_active=False WHERE season_id = $1 AND league_id = $2', [
            data.seasonId,
            data.leagueId
        ]);
    }

    public async endChildSeason(data: IEndChildSeason) {
        await this.childSeasonDb.query('UPDATE child_league_season SET is_active=False WHERE season_id = $1 AND child_league_id = $2', [
            data.seasonId,
            data.childLeagueId
        ]);
        this.eventEmitter.emit(EVENT_VALUES.UPDATE_CACHE_CHILD_SEASON_INFO, data.seasonId);
    }

    public async addSeasonClans(data: ISeasonAddClan) {
        const clanData = {};
        for (const tag of data.clanTags) {
            try {
                const clan = await this.coc.getClan(tag);
                clanData[clan.tag] = clan.name;
            } catch (error) {
                if (error.reason === 'notFound') {
                    throw new HttpException('Clan Not Found!', HttpStatus.NOT_FOUND);
                }
            }
        }

        if (data.clanTags.length === 1) {
            try {
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
                            name: clanData[data.clanTags[0]],
                            tag: data.clanTags[0]
                        }
                    ])
                    .execute();
                this.eventEmitter.emit(EVENT_VALUES.UPDATE_CACHE_SEASON_CHILD_CLANS, data.childId, data.childSeasonId);
            } catch (error) {
                if (error.code === '23505') {
                    throw new HttpException('Clan tag is already registered for season', HttpStatus.BAD_REQUEST);
                }
            }
        } else {
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
                this.eventEmitter.emit(EVENT_VALUES.UPDATE_CACHE_SEASON_CHILD_CLANS, data.childId, data.childSeasonId);
            }
        }
    }

    public async removeSeasonClan(data: ISeasonRemoveClan) {
        await this.leagueClanDb.query('DELETE FROM league_clan WHERE child_id = $1 AND child_season_id = $2 AND tag = $3', [
            data.childId,
            data.childSeasonId,
            data.tag
        ]);
        this.eventEmitter.emit(EVENT_VALUES.UPDATE_CACHE_SEASON_CHILD_CLANS, data.childId, data.childSeasonId);
    }
}
