import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Authenticated } from '~/core/decorators/auth.decorator';
import { ClanService } from './clan.service';

@Controller('clan')
export class ClanController {
	constructor(private readonly clanService: ClanService) {}

	@Get('clans')
	@Authenticated()
	async userClans(@Req() request: FastifyRequest) {
		return await this.clanService.userClans(request);
	}

	@Post('link-clan')
	@Authenticated()
	async linkClan(@Req() request: FastifyRequest, @Body() payload: { clanTag: string }) {
		return await this.clanService.linkClan(request, payload.clanTag);
	}

	@Delete('remove-clan')
	@Authenticated()
	async removeClan(@Req() request: FastifyRequest, @Body() payload: { clanTag: string }) {
		return await this.clanService.removeClan(request, payload.clanTag);
	}
}
