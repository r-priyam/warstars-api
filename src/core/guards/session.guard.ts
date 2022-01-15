import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ContextIdFactory, ModuleRef, Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { getRepository } from 'typeorm';
import { DatabaseSession } from '~/database';
import { DiscordService } from '~/routes/discord/discord.service';
import { AUTH_KEY } from '../decorators/auth.decorator';

@Injectable()
export class SessionGuard implements CanActivate {
	constructor(private readonly reflector: Reflector, private readonly moduleRef: ModuleRef) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const checkAuth = this.reflector.getAllAndOverride(AUTH_KEY, [context.getHandler(), context.getClass()]);
		if (!checkAuth) return true;

		const request: FastifyRequest = context.switchToHttp().getRequest();
		const session = request.session;

		if (!session) throw new UnauthorizedException('You must log in to use this feature.');

		const sessionRepository = getRepository(DatabaseSession);
		const sessionStore = await sessionRepository.findOne({ id: session.sessionId });

		if (!sessionStore) throw new UnauthorizedException('You must log in to use this feature.');

		if (sessionStore.expiredAt < Date.now()) {
			// session expired here, grab the new token from discord and delete the previous one from db
			const contextId = ContextIdFactory.getByRequest(request);
			const discord = await this.moduleRef.resolve(DiscordService, contextId);
			await sessionRepository.delete(sessionStore);
			await discord.handleTokenRefresh();
			return true;
		} else {
			return true;
		}
	}
}
