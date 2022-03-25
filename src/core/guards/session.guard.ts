import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { getRepository } from 'typeorm';

import { DatabaseSession } from '~/database';
import { DiscordService } from '~/routes/discord/discord.service';

import { AUTH_KEY } from '../decorators/auth.decorator';

@Injectable()
export class SessionGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, @Inject(DiscordService) private readonly discordService: DiscordService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const checkAuth = this.reflector.getAllAndOverride(AUTH_KEY, [context.getHandler(), context.getClass()]);
        if (!checkAuth) {
            return true;
        }

        const request: FastifyRequest = context.switchToHttp().getRequest();
        const session = request.session;

        if (!session) {
            throw new UnauthorizedException('You must log in to use this feature.');
        }

        const sessionRepository = getRepository(DatabaseSession);
        await sessionRepository.findOne({});
        const sessionStore = await sessionRepository
            .createQueryBuilder('session')
            .where('session.id = :id', { id: session.sessionId })
            .getOne();

        if (!sessionStore) {
            throw new UnauthorizedException('You must log in to use this feature.');
        }

        if (sessionStore.expiredAt < Date.now()) {
            await sessionRepository.delete(sessionStore);
            await this.discordService.handleTokenRefresh(request);
            return true;
        }
        return true;
    }
}
