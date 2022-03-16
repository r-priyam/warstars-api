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
    async callback(@Req() request: FastifyRequest, @Query() query: { code: string }, @Res() response: FastifyReply) {
        if (!query.code) {
            throw new HttpException('No code received. Please return back to homepage and try to authorize again.', HttpStatus.BAD_REQUEST);
        }

        await this.discordService.handleCallback(request, query.code);
        return response.status(302).redirect(this.config.discord.successRedirect);
    }

    @Get('user')
    @Authenticated()
    user(@Req() request: FastifyRequest) {
        return {
            discordId: request.session.user.discordId,
            username: request.session.user.username,
            discriminator: request.session.user.discriminator,
            avatar: request.session.user.avatar,
            createdAt: request.session.user.createdAt
        };
    }

    @Get('check')
    @Authenticated()
    checkLoggedIn() {}

    @Get('guilds')
    @Authenticated()
    async guilds(@Req() request: FastifyRequest) {
        return await this.discordService.userGuilds(request);
    }

    @Post('logout')
    @Authenticated()
    async logout(@Req() request: FastifyRequest, @Res() response: FastifyReply) {
        await this.discordService.logOut(request);
        request.destroySession(() => {
            response.clearCookie('sessionId');
            response.redirect(this.config.logOutRedirectUrl);
        });
    }
}
