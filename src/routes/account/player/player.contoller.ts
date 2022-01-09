import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { SessionGuard } from '~/core/guards/session.guard';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
	constructor(private readonly playerService: PlayerService) {}

	@Get('players')
	@UseGuards(SessionGuard)
	async userPlayers() {
		return this.playerService.userPlayes();
	}

	@Post('link-player')
	@UseGuards(SessionGuard)
	async linkPlayer(@Body() payload: { playerTag: string; apiToken: string }) {
		return await this.playerService.linkPlayer(payload.playerTag, payload.apiToken);
	}

	@Delete('remove-player')
	@UseGuards(SessionGuard)
	async removePlayer(@Body() payload: { playerTag: string }) {
		return await this.playerService.removePlayer(payload.playerTag);
	}
}
