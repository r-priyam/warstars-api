import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
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
	async userLeaguePermissions(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply) {
		const perms = await this.coreService.getUserLeaguePermissions(request.session.user.discordId);
		response.setCookie('_league_permissions', perms, { maxAge: 180000, secure: false, path: '/' });
		return;
	}
}
