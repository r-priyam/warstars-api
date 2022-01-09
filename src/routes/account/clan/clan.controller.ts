import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { SessionGuard } from '~/core/guards/session.guard';
import { ClanService } from './clan.service';

@Controller('clan')
export class ClanController {
	constructor(private readonly clanService: ClanService) {}

	@Get('clans')
	@UseGuards(SessionGuard)
	async userClans() {
		return this.clanService.userClans();
	}

	@Post('link-clan')
	@UseGuards(SessionGuard)
	async linkClan(@Body() payload: { clanTag: string }) {
		return await this.clanService.linkClan(payload.clanTag);
	}

	@Delete('remove-clan')
	@UseGuards(SessionGuard)
	async removeClan(@Body() payload: { clanTag: string }) {
		return await this.clanService.removeClan(payload.clanTag);
	}
}
