import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Repository } from 'typeorm';
import { ChildLeague, Division, League, LeagueAdmin } from '~/database';
import { IRegisterChildLeague, IRegisterDivision, IRegisterLeague } from '~/utils/interfaces';

@Injectable()
export class RegisterService {
	constructor(
		@InjectRepository(League) private leagueDb: Repository<League>,
		@InjectRepository(ChildLeague) private childLeagueDb: Repository<ChildLeague>,
		@InjectRepository(Division) private divisionDb: Repository<Division>,
		@InjectRepository(LeagueAdmin) private adminDb: Repository<LeagueAdmin>,
		@OgmaLogger(RegisterService) private readonly logger: OgmaService,
		private eventEmitter: EventEmitter2
	) {}

	public async registerLeague(data: IRegisterLeague) {
		const check = await this.leagueDb.query('SELECT EXISTS(SELECT 1 FROM league WHERE discord_id = $1 AND is_verified = False)', [
			data.discordId
		]);
		if (check)
			throw new HttpException(
				'Your one application is pending. You can only submit one league application at a time.',
				HttpStatus.BAD_REQUEST
			);

		try {
			await this.leagueDb
				.createQueryBuilder()
				.insert()
				.values([{ ...data }])
				.execute();
			this.eventEmitter.emit('league.register', data);
		} catch (error) {
			if (error.code === '23505') {
				throw new HttpException(`Abbreviation: ${data.abbreviation}  is already registered!`, HttpStatus.BAD_REQUEST);
			} else {
				this.logger.error(error);
				throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
	}

	public async registerChildLeague(data: IRegisterChildLeague) {
		try {
			await this.childLeagueDb
				.createQueryBuilder()
				.insert()
				.values([{ ...data }])
				.execute();
		} catch (error) {
			if (error.code === '23505') {
				throw new HttpException(`Abbreviation: ${data.abbreviation}  is already registered!`, HttpStatus.BAD_REQUEST);
			} else {
				this.logger.error(error);
				throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
	}

	public async registerDivision(data: IRegisterDivision) {
		try {
			await this.divisionDb
				.createQueryBuilder()
				.insert()
				.values([{ ...data }])
				.execute();
		} catch (error) {
			if (error.code === '23505') {
				throw new HttpException(`Abbreviation: ${data.abbreviation}  is already registered!`, HttpStatus.BAD_REQUEST);
			} else {
				this.logger.error(error);
				throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
	}
}
