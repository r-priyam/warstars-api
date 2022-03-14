import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OgmaService } from '@ogma/nestjs-module';
import { FastifyRequest } from 'fastify';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { RedisService } from '~/core/redis/redis.service';

import { CACHE_KEY } from '../decorators/cacheset.decorator';

@Injectable()
export class CachingInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        @Inject(RedisService) private readonly redisService: RedisService,
        @Inject(OgmaService) private readonly logger: OgmaService
    ) {}

    generateCacheKey() {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const applyCache = this.reflector.getAllAndOverride<{ key: string; ttl: number; paramCache: boolean }>(CACHE_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        const request: FastifyRequest = context.switchToHttp().getRequest();
        if (!applyCache) {
            return next.handle();
        }

        let key = applyCache.key;
        if (applyCache.paramCache) {
            key = `${applyCache.key}/${Object.values(request.params).join('/')}`;
        } else {
            key = `${applyCache.key}/${request.session.user.discordId}`;
        }
        const cached = await this.redisService.get(key);

        if (cached) {
            return of(cached);
        }

        return next.handle().pipe(
            map(async (response) => {
                const cacheData = await this.redisService.set(key, applyCache.ttl, JSON.stringify(response));
                if (!cacheData) {
                    this.logger.warn(`Failed to cache data for key ${applyCache.key}`);
                }
                return response;
            })
        );
    }
}
