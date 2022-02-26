import { BadRequestException, CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { PERMISSIONS_KEY } from '../decorators/leaguepermissions.decorator';
import { CoreService } from '~/routes/league/core/core.service';
import { AdminPermissions, Permission } from '~/utils/AdminPermissions';

@Injectable()
export class LeaguePermission implements CanActivate {
    constructor(private readonly reflector: Reflector, @Inject(CoreService) private readonly leagueCoreService: CoreService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredPermissions) return true;

        const request: FastifyRequest = context.switchToHttp().getRequest();
        const { leagueid } = request.headers;

        if (!leagueid) throw new BadRequestException('League Id is not present in request headers!');

        const leaguePermission = await this.leagueCoreService.getUserLeaguePermission(request.session.user.discordId, +leagueid);

        if (!leaguePermission) throw new UnauthorizedException("You aren't allowed to perform this action.");

        const check = new AdminPermissions(leaguePermission.permissions);
        const checks: Record<number, boolean> = {
            1: check.manageAdmins,
            2: check.managePermissions,
            4: check.manageChildDivisions,
            8: check.administrator,
            16: check.manageChildLeagues,
            32: check.manageClans,
            64: check.manageWarData,
            128: check.manageSeason,
            256: check.manageLeague,
            1024: check.manageLeague
        };
        if (!checks[requiredPermissions[0]]) throw new UnauthorizedException("You aren't allowed to perform this action.");
        return true;
    }
}
