import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { Connection, Repository } from 'typeorm';

import { LeagueAdmin, User } from '~/database';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(LeagueAdmin) private leagueAdminDb: Repository<LeagueAdmin>,
        @OgmaLogger(AdminService) private readonly logger: OgmaService,
        @InjectConnection() private readonly db: Connection,
        @InjectRepository(User) private userDb: Repository<User>
    ) {}

    private async checkHeadAdmin(leagueId: number, discordId: string) {
        const data = await this.leagueAdminDb
            .createQueryBuilder('user')
            .where('user.discord_id = :discordId AND user.league_id = :leagueId', { discordId, leagueId })
            .getOne();
        if (!data.headAdmin) throw new HttpException("You are't allowed to perform this action.", HttpStatus.UNAUTHORIZED);
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

        if (!check) throw new HttpException('User is not yet registered on this site.', HttpStatus.NOT_FOUND);
        try {
            return await this.leagueAdminDb
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
        } catch (error) {
            if (error.code === '23505') throw new HttpException('User is already a super admin for this league!', HttpStatus.BAD_REQUEST);
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
    }

    public async removeAdmin(userDiscordId: string, adminId: number, leagueId: number) {
        await this.checkHeadAdmin(leagueId, userDiscordId);
        await this.leagueAdminDb.query('DELETE FROM league_admin WHERE id = $1 AND league_id = $2', [adminId, leagueId]);
    }
}
