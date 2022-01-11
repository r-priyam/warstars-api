import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { Repository } from 'typeorm';
import { LeagueAdmin } from '~/database';

@Injectable()
export class AdminService {
	constructor(
		@InjectRepository(LeagueAdmin) private leagueAdminDb: Repository<LeagueAdmin>,
		@OgmaLogger(AdminService) private readonly logger: OgmaService
	) {}

	public async adminInfo(leagueId: number, adminId: number) {
		try {
			const data = await this.leagueAdminDb
				.createQueryBuilder('admin')
				.where('admin.league_id = :leagueid AND admin.id = :adminId', { leagueId: leagueId, adminId: adminId })
				.getOne();
			return data;
		} catch (error) {
			this.logger.error(error);
			throw new HttpException('Soemething went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public async admins(leagueId: number) {
		try {
			const data = await this.leagueAdminDb
				.createQueryBuilder('admin')
				.where('admin.league_id = :leagueId', { leagueId: leagueId })
				.getMany();
			return data;
		} catch (error) {
			this.logger.error(error);
			throw new HttpException('Soemething went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public async addAdmin(discordId: string, leagueId: number, permissions: number) {
		try {
			const data = await this.leagueAdminDb
				.createQueryBuilder()
				.insert()
				.values([{ discordId: discordId, leagueId: leagueId, permissions: permissions }])
				.execute();
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
			.set({ permissions: permissions })
			.where('league_id = :leagueId AND id = :adminId', { leagueId: leagueId, adminId: adminId })
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
