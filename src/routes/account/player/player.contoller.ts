import { Body, Controller, Delete, Get, HttpCode, Post, Req } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import type { PlayerService } from './player.service';
import { Authenticated } from '~/core/decorators/auth.decorator';

@Controller('player')
export class PlayerController {
    constructor(private readonly playerService: PlayerService) {}

    @Get('players')
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
