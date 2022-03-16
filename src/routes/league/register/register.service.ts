import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChildLeague, Division, League } from '~/database';
import { IRegisterChildLeague, IRegisterDivision, IRegisterLeague } from '~/utils/interfaces';

@Injectable()
export class RegisterService {
    constructor(
        @InjectRepository(League) private leagueDb: Repository<League>,
        @InjectRepository(ChildLeague) private childLeagueDb: Repository<ChildLeague>,
        @InjectRepository(Division) private divisionDb: Repository<Division>,
        private eventEmitter: EventEmitter2
    ) {}

    public async registerLeague(data: IRegisterLeague) {
        const check = await this.leagueDb.query('SELECT * FROM league WHERE discord_id = $1 AND is_verified = $2', [data.discordId, false]);

        if (check.length > 0) {
            throw new HttpException(
                'Your one application is pending. You can only submit one league application at a time.',
                HttpStatus.BAD_REQUEST
            );
        }

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
            }
        }
    }
}
