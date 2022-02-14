import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { Permission } from '~/utils/AdminPermissions';
import { PERMISSIONS_KEY } from '../decorators/leaguepermissions.decorator';

@Injectable()
export class LeaguePermission implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (!requiredPermissions) return true;

        const request: FastifyRequest = context.switchToHttp().getRequest();
        const { leagueid } = request.headers;
        const permsCookie = request.cookies._league_permissions;

        if (!leagueid) throw new BadRequestException('League Id is not present in request headers!');
        console.log(permsCookie);

        return true;
    }
}
