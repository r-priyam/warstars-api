import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { Authenticated } from '~/core/decorators/auth.decorator';
import { ClanService } from './clan.service';

@Controller('clan')
export class ClanController {
	constructor(private readonly clanService: ClanService) {}

	@Get('clans')
	@Authenticated()
	async userClans() {
		return await this.clanService.userClans();
	}

	@Post('link-clan')
	@Authenticated()
	async linkClan(@Body() payload: { clanTag: string }) {
		return await this.clanService.linkClan(payload.clanTag);
	}

	@Delete('remove-clan')
	@Authenticated()
	async removeClan(@Body() payload: { clanTag: string }) {
		return await this.clanService.removeClan(payload.clanTag);
	}
}
