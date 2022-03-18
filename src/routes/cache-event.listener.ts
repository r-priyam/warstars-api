import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { CacheService } from '~/core/redis/cache.service';
import { CACHE_SET_VALUES, EVENT_VALUES } from '~/utils/Constants';

import { AdminService } from './league/admin/admin.service';
import { CoreService } from './league/core/core.service';
import { SeasonService } from './league/season/season.service';

@Injectable()
export class CacheUpdateListener {
    constructor(
        private readonly cacheService: CacheService,
        private readonly adminService: AdminService,
        private readonly coreService: CoreService,
        private readonly seasonService: SeasonService
    ) {}

    @OnEvent(EVENT_VALUES.UPDATE_CACHE_USER_PLAYER)
    async handleUserPlayerCache() {}

    @OnEvent(EVENT_VALUES.UPDATE_CACHE_USER_CLANS)
    async handleUserClanCache() {}

    @OnEvent(EVENT_VALUES.UPDATE_CACHE_LEAGUE_ADMINS)
    async handleLeagueAdminsCache(leagueId: number) {
        const admins = await this.adminService.admins(leagueId);
        await this.cacheService.set(
            `${CACHE_SET_VALUES.LEAGUE_ADMINS.key}/${leagueId}`,
            JSON.stringify(admins),
            CACHE_SET_VALUES.LEAGUE_ADMINS.ttl
        );
    }

    @OnEvent(EVENT_VALUES.UPDATE_CACHE_USER_LEAGUES)
    async handleUserLeagueCache(discordId: string) {
        const userLeagues = await this.coreService.getUserLeagues(discordId);
        if (userLeagues.length === 0) {
            await this.cacheService.delete(`${CACHE_SET_VALUES.USER_LEAGUES.key}/${discordId}`);
        } else {
            await this.cacheService.set(
                `${CACHE_SET_VALUES.USER_LEAGUES.key}/${discordId}`,
                JSON.stringify(userLeagues),
                CACHE_SET_VALUES.USER_LEAGUES.ttl
            );
        }
    }

    @OnEvent(EVENT_VALUES.UPDATE_CACHE_CHILD_SEASON_INFO)
    async handleChildSeasonInfoCache(seasonId: number) {
        const childSeasonData = await this.seasonService.childSeasonInfo(seasonId);
        await this.cacheService.set(
            `${CACHE_SET_VALUES.CHILD_SEASON_INFO.key}/${seasonId}`,
            JSON.stringify(childSeasonData),
            CACHE_SET_VALUES.CHILD_SEASON_INFO.ttl
        );
    }

    @OnEvent(EVENT_VALUES.UPDATE_CACHE_SEASON_CHILD_CLANS)
    async handleSeasonChildClansCache(childId: number, seasonId: number) {
        const seasonChildClans = this.seasonService.getSeasonChildClans(childId, seasonId);
        await this.cacheService.set(
            `${CACHE_SET_VALUES.SEASON_CHILD_CLANS.key}/${childId}/${seasonId}`,
            JSON.stringify(seasonChildClans),
            CACHE_SET_VALUES.SEASON_CHILD_CLANS.ttl
        );
    }

    @OnEvent(EVENT_VALUES.HANDLE_LEAGUE_CHANGES)
    async handleLeagueChanges(leagueId: number) {
        const admins = await this.adminService.admins(leagueId);
        admins.forEach(async (data: { discordId: string }) => {
            const userLeagues = await this.coreService.getUserLeagues(data.discordId);
            if (userLeagues.length === 0) {
                await this.cacheService.delete(`${CACHE_SET_VALUES.USER_LEAGUES.key}/${data.discordId}`);
            } else {
                await this.cacheService.set(
                    `${CACHE_SET_VALUES.USER_LEAGUES.key}/${data.discordId}`,
                    JSON.stringify(userLeagues),
                    CACHE_SET_VALUES.USER_LEAGUES.ttl
                );
            }
        });
    }
}
