/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { CoreService } from './core.service';
import { AppConfig } from '~/core/config/env.getters';
import { Authenticated } from '~/core/decorators/auth.decorator';

@Controller('core')
export class CoreController {
    constructor(private readonly coreService: CoreService, private readonly config: AppConfig) {}

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
        response.setCookie('_league_permissions', perms, { maxAge: 180000, secure: false, path: '/', domain: this.config.cookieDomain });
    }
}
