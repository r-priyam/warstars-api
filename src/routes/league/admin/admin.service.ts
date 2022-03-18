import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { LeagueAdmin, User } from '~/database';
import { EVENT_VALUES } from '~/utils/Constants';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(LeagueAdmin) private leagueAdminDb: Repository<LeagueAdmin>,
        @InjectConnection() private readonly db: Connection,
        @InjectRepository(User) private userDb: Repository<User>,
        private eventEmitter: EventEmitter2
    ) {}

    private async checkHeadAdmin(leagueId: number, discordId: string) {
        const data = await this.leagueAdminDb
            .createQueryBuilder('user')
            .where('user.discord_id = :discordId AND user.league_id = :leagueId', { discordId, leagueId })
            .getOne();
        if (!data.headAdmin) {
            throw new HttpException("You aren't allowed to perform this action.", HttpStatus.UNAUTHORIZED);
        }
    }

    public async adminsDiscord(leagueId: number) {
        return await this.leagueAdminDb
            .createQueryBuilder('admin')
            .select(['admin.discord_id'])
            .where('admin.league_id = :leagueId', { leagueId })
            .getMany();
    }

    public async admins(leagueId: number) {
        const query = `SELECT t1.id, t1.discord_id AS "discordId", t1.league_id AS "leagueId", t1.permissions, t1.head_admin AS "headAdmin", t1.added_at AS "addedAt", 
			t2.user_name AS "username", t2.discriminator, t2.avatar 
			FROM league_admin t1 LEFT JOIN users t2 USING(discord_id) 
			WHERE t1.league_id = $1`;
        return await this.db.query(query, [leagueId]);
    }

    public async addAdmin(userDiscordId: string, discordId: string, leagueId: number, permissions: number) {
        await this.checkHeadAdmin(leagueId, userDiscordId);
        const check = await this.userDb.query('SELECT EXISTS(SELECT 1 FROM users WHERE discord_id = $1)', [discordId]);

        if (!check[0].exists) {
            throw new HttpException('User is not yet registered on this site.', HttpStatus.NOT_FOUND);
        }
        try {
            await this.leagueAdminDb
                .createQueryBuilder()
                .insert()
                .values([
                    {
                        discordId,
                        leagueId,
                        permissions
                    }
                ])
                .execute();
            this.eventEmitter.emit(EVENT_VALUES.UPDATE_CACHE_LEAGUE_ADMINS, leagueId);
            this.eventEmitter.emit(EVENT_VALUES.UPDATE_CACHE_USER_LEAGUES, leagueId);
        } catch (error) {
            if (error.code === '23505') {
                throw new HttpException('User is already a super admin for this league!', HttpStatus.BAD_REQUEST);
            }
        }
    }

    public async updateAdminPermissions(userDiscordId: string, leagueId: number, adminId: number, permissions: number) {
        await this.checkHeadAdmin(leagueId, userDiscordId);
        await this.leagueAdminDb
            .createQueryBuilder()
            .update()
            .set({ permissions })
            .where('league_id = :leagueId AND id = :adminId', { leagueId, adminId })
            .execute();
        this.eventEmitter.emit(EVENT_VALUES.UPDATE_CACHE_LEAGUE_ADMINS, leagueId);
    }

    public async removeAdmin(userDiscordId: string, adminId: number, adminDiscordId: string, leagueId: number) {
        await this.checkHeadAdmin(leagueId, userDiscordId);
        await this.leagueAdminDb.query('DELETE FROM league_admin WHERE id = $1 AND league_id = $2', [adminId, leagueId]);
        this.eventEmitter.emit(EVENT_VALUES.UPDATE_CACHE_LEAGUE_ADMINS, leagueId);
        this.eventEmitter.emit(EVENT_VALUES.UPDATE_CACHE_USER_LEAGUES, leagueId);
    }
}
