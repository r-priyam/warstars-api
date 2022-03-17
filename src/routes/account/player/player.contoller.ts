import { Body, Controller, Delete, Get, HttpCode, Post, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { Authenticated } from '~/core/decorators/auth.decorator';
import { Cache } from '~/core/decorators/cacheset.decorator';
import { CACHE_SET_VALUES } from '~/utils/Constants';

import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
    constructor(private readonly playerService: PlayerService) {}

    @Get('players')
    @Cache(CACHE_SET_VALUES.USER_PLAYERS)
    @Authenticated()
    async userPlayers(@Req() request: FastifyRequest) {
        return await this.playerService.userPlayers(request);
    }

    @Post('link-player')
    @Authenticated()
    @HttpCode(200)
    async linkPlayer(@Req() request: FastifyRequest, @Body() payload: { playerTag: string; apiToken: string }) {
        return await this.playerService.linkPlayer(request, payload.playerTag, payload.apiToken);
    }

    @Delete('remove-player')
    @Authenticated()
    async removePlayer(@Req() request: FastifyRequest, @Body() payload: { playerTag: string }) {
        return await this.playerService.removePlayer(request, payload.playerTag);
    }
}
