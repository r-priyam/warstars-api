import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { Authenticated } from '~/core/decorators/auth.decorator';
import { Permission } from '~/utils/AdminPermissions';
import { Permissions } from '~/core/decorators/leaguepermissions.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@Get('info')
	async adminInfo(@Body() payload: { leagueId: number; adminId: number }) {
		return await this.adminService.adminInfo(payload.leagueId, payload.adminId);
	}

	@Get('admins')
	async admins(@Body() payload: { leagueId: number }) {
		return await this.adminService.admins(payload.leagueId);
	}

	@Post('add-admin')
	@Authenticated()
	@Permissions(Permission.MANAGE_ADMINS)
	async addAdmin(@Body() payload: { discordId: string; leagueId: number; permissions: number }) {
		return await this.adminService.addAdmin(payload.discordId, payload.leagueId, payload.permissions);
	}

	@Put('update-permission')
	@Authenticated()
	@Permissions(Permission.MANAGE_ADMINS)
	async updateAdminPermission(@Body() payload: { leagueId: number; adminId: number; permissions: number }) {
		return await this.adminService.updateAdminPermissions(payload.leagueId, payload.adminId, payload.permissions);
	}

	@Delete('remove-admin')
	@Authenticated()
	@Permissions(Permission.MANAGE_ADMINS)
	async removeAdmin(@Body() payload: { adminId: number; leagueId: number }) {
		return await this.adminService.removeAdmin(payload.adminId, payload.leagueId);
	}
}
