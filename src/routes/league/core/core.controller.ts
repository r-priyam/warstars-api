import { Controller, Get, Param, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Authenticated } from '~/core/decorators/auth.decorator';
import { CoreService } from './core.service';

@Controller('core')
export class CoreController {
	constructor(private readonly coreService: CoreService) {}

	@Get('league-info/:leagueId')
	async leagueInfo(@Param('leagueId') leagueId: number) {
		return await this.coreService.getLeagueInfo(leagueId);
	}

	@Get('child-league-info/:childLeagueId')
	async childLeagueInfo(@Param('childLeagueId') chidlLeagueId: number) {
		return await this.childLeagueInfo(chidlLeagueId);
	}

	@Get('user-leagues')
	@Authenticated()
	async userLeagues(@Req() request: FastifyRequest) {
		return await this.coreService.getUserLeagues(request.session.user.discordId);
	}

	@Get('user-league-permissions')
	@Authenticated()
	async userLeaguePermissions(@Req() request: FastifyRequest) {
		return await this.coreService.getUserLeaguePermissions(request.session.user.discordId);
	}
}
