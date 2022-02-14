import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import type { OgmaService } from '@ogma/nestjs-module';
import { OgmaLogger } from '@ogma/nestjs-module';
import type { Connection, Repository } from 'typeorm';
import { LeagueAdmin } from '~/database';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(LeagueAdmin) private leagueAdminDb: Repository<LeagueAdmin>,
        @OgmaLogger(AdminService) private readonly logger: OgmaService,
        @InjectConnection() private readonly db: Connection
    ) {}

    public async admins(leagueId: number) {
        try {
            const query = `SELECT t1.id, t1.discord_id AS "discordId", t1.league_id AS "leagueId", t1.permissions, t1.added_at AS "addedAt", 
			t2.user_name AS "username", t2.discriminator, t2.avatar 
			FROM league_admin t1 LEFT JOIN users t2 USING(discord_id) 
			WHERE t1.league_id = $1`;
            const data = await this.db.query(query, [leagueId]);
            return data;
        } catch (error) {
            this.logger.error(error);
            throw new HttpException('Soemething went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async addAdmin(discordId: string, leagueId: number, permissions: number) {
        try {
            const data = await this.leagueAdminDb.createQueryBuilder().insert().values([{ discordId, leagueId, permissions }]).execute();
            return data;
        } catch (error) {
            if (error.code === '23505') {
                throw new HttpException('User is already a super admin for this league!', HttpStatus.BAD_REQUEST);
            } else {
                this.logger.error(error);
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    public async updateAdminPermissions(leagueId: number, adminId: number, permissions: number) {
        await this.leagueAdminDb
            .createQueryBuilder()
            .update()
            .set({ permissions })
            .where('league_id = :leagueId AND id = :adminId', { leagueId, adminId })
            .execute();
    }

    public async removeAdmin(adminId: number, leagueId: number) {
        try {
            await this.leagueAdminDb.query('DELETE FROM league_admin WHERE id = $1 AND league_id = $2', [adminId, leagueId]);
        } catch (error) {
            this.logger.error(error);
            throw new HttpException('Soemething went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
