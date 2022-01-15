import { Controller, Get, HttpException, HttpStatus, Post, Query, Req, Res } from '@nestjs/common';
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
	async callback(@Query() query: { code: string }, @Res() response: FastifyReply) {
		if (!query.code)
			throw new HttpException('No code received. Please return back to homepage and try to authorize again.', HttpStatus.BAD_REQUEST);

		await this.discordService.handleCallback(query.code);
		return response.status(302).redirect(this.config.discord.successRedirect);
	}

	@Get('user')
	@Authenticated()
	user(@Req() request: FastifyRequest) {
		const user = request.session.user;
		['id', 'email', 'accessToken', 'refreshToken'].forEach((e) => delete user[e]);
		return user;
	}

	@Get('check')
	@Authenticated()
	checkLoggedIn() {
		return;
	}

	@Get('guilds')
	@Authenticated()
	async guilds() {
		return await this.discordService.userGuilds();
	}

	@Post('logout')
	@Authenticated()
	async logout(@Req() request: FastifyRequest, @Res() response: FastifyReply) {
		await this.discordService.logOut();
		request.destroySession((error) => {
			if (error) throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
			else response.clearCookie('sessionId').status(302).redirect(this.config.logOutRedirectUrl);
		});
	}
}
