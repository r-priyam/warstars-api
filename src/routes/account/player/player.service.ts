import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { Util } from 'clashofclans.js';
import { FastifyRequest } from 'fastify';
import { Repository } from 'typeorm';
import { ClashService } from '~/core/clash/clash.service';
import { UserPlayer } from '~/database';

@Injectable({ scope: Scope.REQUEST })
export class PlayerService {
	constructor(
		@Inject(REQUEST) private readonly request: FastifyRequest,
		@InjectRepository(UserPlayer) private playerDb: Repository<UserPlayer>,
		@OgmaLogger(PlayerService) private readonly logger: OgmaService,
		private readonly clash: ClashService
	) {}
	private coc = this.clash.clashClient;
	private PG_UNIQUE_CONSTRAINT_VIOLATION = '23505';

	public async userPlayes() {
		try {
			const data = await this.playerDb
				.createQueryBuilder('user')
				.where('user.discord_id = :discordId', { discordId: this.request.session.user.discordId })
				.getMany();
			return data;
		} catch (error) {
			this.logger.error(error);
			throw new HttpException('Soemething went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public async linkPlayer(playerTag: string, apiToken: string) {
		if (!Util.isValidTag(Util.formatTag(playerTag))) throw new HttpException('Invalid Player Tag!', HttpStatus.NOT_ACCEPTABLE);

		let status: boolean;
		try {
			status = await this.coc.verifyPlayerToken(Util.formatTag(playerTag), apiToken);
			if (!status) throw new HttpException('Invalid API Token!', HttpStatus.BAD_REQUEST);
		} catch (error) {
			if (error.reason === 'notFound') throw new HttpException('Player Not Found!', HttpStatus.NOT_FOUND);
			else {
				this.logger.error(error);
				throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}

		try {
			await this.playerDb
				.createQueryBuilder()
				.insert()
				.values([{ discordId: this.request.session.user.discordId, playerTag: Util.formatTag(playerTag) }])
				.execute();
			return 'Player linked successfully';
		} catch (error) {
			if (error.code === this.PG_UNIQUE_CONSTRAINT_VIOLATION) {
				throw new HttpException('Player is already linked', HttpStatus.BAD_REQUEST);
			} else {
				this.logger.error(error);
				throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
	}

	public async removePlayer(playerTag: string) {
		let data: any;
		try {
			data = await this.playerDb.query('DELETE FROM user_player WHERE discord_id = $1 AND player_tag = $2', [
				this.request.session.user.discordId,
				Util.formatTag(playerTag)
			]);
		} catch (error) {
			this.logger.error(error);
			throw new HttpException('Soemething went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (data[1] === 0) throw new HttpException('Player Tag not linked!', HttpStatus.CONFLICT);
	}
}
