import { Body, Controller, Delete, Get, HttpCode, Post, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { Authenticated } from '~/core/decorators/auth.decorator';
import { Cache } from '~/core/decorators/cacheset.decorator';
import { CACHE_SET_VALUES } from '~/utils/Constants';

import { ClanService } from './clan.service';

@Controller('clan')
export class ClanController {
    constructor(private readonly clanService: ClanService) {}

    @Get('clans')
    @Authenticated()
    @Cache(CACHE_SET_VALUES.USER_CLANS)
    async userClans(@Req() request: FastifyRequest) {
        return await this.clanService.userClans(request);
    }

    @Post('link-clan')
    @Authenticated()
    @HttpCode(200)
    async linkClan(@Req() request: FastifyRequest, @Body() payload: { clanTag: string }) {
        return await this.clanService.linkClan(request, payload.clanTag);
    }

    @Delete('remove-clan')
    @Authenticated()
    async removeClan(@Req() request: FastifyRequest, @Body() payload: { clanTag: string }) {
        return await this.clanService.removeClan(request, payload.clanTag);
    }
}
