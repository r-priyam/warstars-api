import { Controller, Get, Param, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { Authenticated } from '~/core/decorators/auth.decorator';
import { Cache } from '~/core/decorators/cacheset.decorator';
import { CACHE_SET_VALUES, ROUTES_PREFIX } from '~/utils/Constants';

import { CoreService } from './core.service';

@Controller(ROUTES_PREFIX.LEAGUE.CORE)
export class CoreController {
    constructor(private readonly coreService: CoreService) {}

    @Get('league-info/:leagueId')
    async leagueInfo(@Param('leagueId') leagueId: number) {
        return await this.coreService.getLeagueInfo(leagueId);
    }

    @Get('child-league-info/:childLeagueId')
    async childLeagueInfo(@Param('childLeagueId') childLeagueId: number) {
        return await this.coreService.getChildLeagueInfo(childLeagueId);
    }

    @Get('user-leagues')
    @Cache(CACHE_SET_VALUES.USER_LEAGUES)
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
