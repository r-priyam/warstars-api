import { Controller, Get, HttpException, HttpStatus, Query, Req, Res } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { AppConfig } from '~/core/config/env.getters';
import { Authenticated } from '~/core/decorators/auth.decorator';
import { DiscordService } from './discord.service';

@Controller('discord')
export class DiscordController {
	constructor(private readonly config: AppConfig, private readonly discordService: DiscordService) {}

	@Get('login')
	login(@Res() response: FastifyReply): FastifyReply {
		return response.status(302).redirect(this.config.discord.authRedirect);
	}

	@Get('callback')
	async callback(@Query() query: { code: string }) {
		if (!query.code)
			throw new HttpException('No code received. Please return back to homepage and try to authorize again.', HttpStatus.BAD_REQUEST);

		return await this.discordService.handleCallback(query.code);
	}

	@Get('guilds')
	@Authenticated()
	async guilds() {
		return await this.discordService.userGuilds();
	}

	@Get('logout')
	@Authenticated()
	async logout(@Req() request: FastifyRequest, @Res() response: FastifyReply) {
		await this.discordService.logOut();
		request.destroySession((error) => {
			if (error) throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
			else response.status(302).redirect(this.config.logOutRedirectUrl);
		});
	}
}
