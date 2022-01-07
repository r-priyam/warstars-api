import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { DatabaseSession } from '~/database';
import { DiscordService } from '~/routes/discord/discord.service';

@Injectable()
export class SessionGuard implements CanActivate {
	constructor(@Inject(DiscordService) private readonly discordService: DiscordService) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		const session = request.session;

		if (!session)
			throw new HttpException(
				{
					status: HttpStatus.UNAUTHORIZED,
					error: 'You must log in to use this feature.'
				},
				HttpStatus.UNAUTHORIZED
			);

		const sessionRepository = getRepository(DatabaseSession);
		const sessionStore = await sessionRepository.findOne({ id: session.sessionId });

		if (!sessionStore)
			throw new HttpException(
				{
					status: HttpStatus.UNAUTHORIZED,
					error: 'You must log in to use this feature.'
				},
				HttpStatus.UNAUTHORIZED
			);

		if (sessionStore.expiredAt < Date.now()) {
			await sessionRepository.delete(sessionStore);
			await this.discordService.handleTokenRefresh();
		} else {
			return true;
		}
	}
}
