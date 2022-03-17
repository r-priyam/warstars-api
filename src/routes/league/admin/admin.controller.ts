import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

import { Authenticated } from '~/core/decorators/auth.decorator';
import { Cache } from '~/core/decorators/cacheset.decorator';
import { CACHE_SET_VALUES } from '~/utils/Constants';

import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('admins/:leagueId')
    @Cache(CACHE_SET_VALUES.LEAGUE_ADMINS)
    async admins(@Param('leagueId') leagueId: number) {
        return await this.adminService.admins(leagueId);
    }

    @Post('add-admin')
    @Authenticated()
    @HttpCode(200)
    async addAdmin(@Req() request: FastifyRequest, @Body() payload: { discordId: string; leagueId: number; permissions: number }) {
        return await this.adminService.addAdmin(request.session.user.discordId, payload.discordId, payload.leagueId, payload.permissions);
    }

    @Put('update-permission')
    @Authenticated()
    async updateAdminPermission(
        @Req() request: FastifyRequest,
        @Body() payload: { leagueId: number; adminId: number; permissions: number }
    ) {
        return await this.adminService.updateAdminPermissions(
            request.session.user.discordId,
            payload.leagueId,
            payload.adminId,
            payload.permissions
        );
    }

    @Delete('remove-admin')
    @Authenticated()
    async removeAdmin(@Req() request: FastifyRequest, @Body() payload: { adminId: number; leagueId: number }) {
        return await this.adminService.removeAdmin(request.session.user.discordId, payload.adminId, payload.leagueId);
    }
}
