import { BadRequestException, CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';

import { CoreService } from '~/routes/league/core/core.service';
import { AdminPermissions, Permission } from '~/utils/AdminPermissions';

import { PERMISSIONS_KEY } from '../decorators/leaguepermissions.decorator';

@Injectable()
export class LeaguePermission implements CanActivate {
    constructor(private readonly reflector: Reflector, @Inject(CoreService) private readonly leagueCoreService: CoreService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredPermissions) {
            return true;
        }

        const request: FastifyRequest = context.switchToHttp().getRequest();
        const { leagueid } = request.headers;

        if (!leagueid) {
            throw new BadRequestException('League Id is not present in request headers!');
        }

        const leaguePermission = await this.leagueCoreService.getUserLeaguePermission(request.session.user.discordId, +leagueid);

        if (!leaguePermission) {
            throw new UnauthorizedException("You aren't allowed to perform this action.");
        }

        const check = new AdminPermissions(leaguePermission.permissions);
        const checks: Record<number, boolean> = {
            2: check.manageChildDivisions,
            4: check.manageChildLeagues,
            8: check.administrator,
            16: check.manageClans,
            32: check.manageWarData,
            64: check.manageSeason,
            128: check.manageLeague
        };
        if (!checks[requiredPermissions[0]]) {
            throw new UnauthorizedException("You aren't allowed to perform this action.");
        }
        return true;
    }
}
