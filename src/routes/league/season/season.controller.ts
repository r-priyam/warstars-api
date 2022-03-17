import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';

import { Authenticated } from '~/core/decorators/auth.decorator';
import { Cache } from '~/core/decorators/cacheset.decorator';
import { Permissions } from '~/core/decorators/leaguepermissions.decorator';
import { Permission } from '~/utils/AdminPermissions';
import { CACHE_SET_VALUES } from '~/utils/Constants';
import {
    IEndChildSeason,
    IEndLeagueSeason,
    INewChildLeagueSeason,
    INewLeagueSeason,
    ISeasonAddClan,
    ISeasonRemoveClan
} from '~/utils/interfaces';

import { SeasonService } from './season.service';

@Controller('season')
export class SeasonController {
    constructor(private readonly seasonService: SeasonService) {}

    @Get('info/:seasonId')
    async seasonInfo(@Param('seasonId') seasonId: number) {
        return await this.seasonService.seasonInfo(seasonId);
    }

    @Get('child-info/:seasonId')
    @Cache(CACHE_SET_VALUES.CHILD_SEASON_INFO)
    async childSeasonInfo(@Param('seasonId') seasonId: number) {
        return await this.seasonService.childSeasonInfo(seasonId);
    }

    @Get('child-clans/:childId/:seasonId')
    @Cache(CACHE_SET_VALUES.SEASON_CHILD_CLANS)
    async seasonChildClans(@Param('childId') childId: number, @Param('seasonId') seasonId: number) {
        return await this.seasonService.getChildSeasonClans(childId, seasonId);
    }

    @Post('new')
    @Authenticated()
    @Permissions(Permission.MANAGE_SEASON)
    @HttpCode(200)
    async newLeagueSeason(@Body() payload: INewLeagueSeason) {
        return await this.seasonService.newLeagueSeason(payload);
    }

    @Post('new-child')
    @Authenticated()
    @Permissions(Permission.MANAGE_SEASON)
    @HttpCode(200)
    async newChildSeason(@Body() payload: INewChildLeagueSeason) {
        return await this.seasonService.newChildSeason(payload);
    }

    @Put('end')
    @Authenticated()
    @Permissions(Permission.MANAGE_SEASON)
    async endLeagueSeason(@Body() payload: IEndLeagueSeason) {
        return await this.seasonService.endLeagueSeason(payload);
    }

    @Put('end-child')
    @Authenticated()
    @Permissions(Permission.MANAGE_SEASON)
    async endChildSeason(@Body() payload: IEndChildSeason) {
        return await this.seasonService.endChildSeason(payload);
    }

    @Post('add-clans')
    @Authenticated()
    @Permissions(Permission.MANAGE_CLANS)
    @HttpCode(200)
    async addClans(@Body() payload: ISeasonAddClan) {
        return await this.seasonService.addSeasonClans(payload);
    }

    @Delete('remove-clan')
    @Authenticated()
    @Permissions(Permission.MANAGE_CLANS)
    async removeClan(@Body() payload: ISeasonRemoveClan) {
        return await this.seasonService.removeSeasonClan(payload);
    }
}
