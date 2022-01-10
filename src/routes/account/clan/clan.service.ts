import { HttpException, HttpStatus, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { Util } from 'clashofclans.js';
import type { Clan } from 'clashofclans.js';
import { FastifyRequest } from 'fastify';
import { Repository } from 'typeorm';
import { ClashService } from '~/core/clash/clash.service';
import { UserClan } from '~/database';

@Injectable({ scope: Scope.REQUEST })
export class ClanService {
	constructor(
		@Inject(REQUEST) private readonly request: FastifyRequest,
		@InjectRepository(UserClan) private clanDb: Repository<UserClan>,
		@OgmaLogger(ClanService) private readonly logger: OgmaService,
		private readonly clash: ClashService
	) {}
	private coc = this.clash.clashClient;

	public async userClans() {
		try {
			const data = await this.clanDb
				.createQueryBuilder('user')
				.where('user.discord_id = :discordId', { discordId: this.request.session.user.discordId })
				.getMany();
			return data;
		} catch (error) {
			this.logger.error(error);
			throw new HttpException('Soemething went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public async linkClan(clanTag: string) {
		if (!Util.isValidTag(Util.formatTag(clanTag))) throw new HttpException('Invalid Clan Tag!', HttpStatus.NOT_ACCEPTABLE);

		let clan: Clan;
		try {
			clan = await this.coc.getClan(clanTag);
		} catch (error) {
			if (error.reason === 'notFound') throw new HttpException('Clan Not Found!', HttpStatus.NOT_FOUND);
			else {
				this.logger.error(error);
				throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}

		try {
			await this.clanDb
				.createQueryBuilder()
				.insert()
				.values([{ discordId: this.request.session.user.discordId, clanTag: clan.tag }])
				.execute();
		} catch (error) {
			if (error.code === '23505') {
				throw new HttpException('Clan is already linked', HttpStatus.BAD_REQUEST);
			} else {
				this.logger.error(error);
				throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
	}

	public async removeClan(clanTag: string) {
		let data: any;
		try {
			data = await this.clanDb.query('DELETE FROM user_clan WHERE discord_id = $1 AND clan_tag = $2', [
				this.request.session.user.discordId,
				Util.formatTag(clanTag)
			]);
		} catch (error) {
			this.logger.error(error);
			throw new HttpException('Soemething went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
		}
		if (data[1] === 0) throw new HttpException('Clan Tag not linked!', HttpStatus.CONFLICT);
	}
}
