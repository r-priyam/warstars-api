import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Authenticated } from '~/core/decorators/auth.decorator';
import { Permissions } from '~/core/decorators/leaguepermissions.decorator';
import { Permission } from '~/utils/AdminPermissions';
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
	async childSeasonInfo(@Param('seasonId') seasonId: number) {
		return await this.seasonService.childSeasonInfo(seasonId);
	}

	@Get('child-clans/:childId/:seasonId')
	async seasonChildClans(@Param('childId') childId: number, @Param('seasonId') seasonId: number) {
		return await this.seasonService.getChildSeasonClans(childId, seasonId);
	}

	@Post('new')
	@Authenticated()
	@Permissions(Permission.MANAGE_SEASON)
	async newLeagueSeason(@Body() payload: INewLeagueSeason) {
		return await this.newLeagueSeason(payload);
	}

	@Post('new-child')
	@Authenticated()
	@Permissions(Permission.MANAGE_SEASON)
	async newChildSason(@Body() payload: INewChildLeagueSeason) {
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
