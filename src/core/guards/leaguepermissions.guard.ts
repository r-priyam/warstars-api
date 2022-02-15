import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Reflector } from '@nestjs/core';
import type { FastifyRequest } from 'fastify';
import { PERMISSIONS_KEY } from '../decorators/leaguepermissions.decorator';
import type { Permission } from '~/utils/AdminPermissions';

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
        // const permsCookie = request.cookies._league_permissions;

        if (!leagueid) throw new BadRequestException('League Id is not present in request headers!');

        return true;
    }
}
