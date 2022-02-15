import { Body, Controller, Delete, Get, HttpCode, Post, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ClanService } from './clan.service';
import { Authenticated } from '~/core/decorators/auth.decorator';

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
