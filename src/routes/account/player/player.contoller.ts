import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { Authenticated } from '~/core/decorators/auth.decorator';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
	constructor(private readonly playerService: PlayerService) {}

	@Get('players')
	@Authenticated()
	async userPlayers() {
		return this.playerService.userPlayes();
	}

	@Post('link-player')
	@Authenticated()
	async linkPlayer(@Body() payload: { playerTag: string; apiToken: string }) {
		return await this.playerService.linkPlayer(payload.playerTag, payload.apiToken);
	}

	@Delete('remove-player')
	@Authenticated()
	async removePlayer(@Body() payload: { playerTag: string }) {
		return await this.playerService.removePlayer(payload.playerTag);
	}
}
