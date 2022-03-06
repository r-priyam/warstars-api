import { Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { style } from '@ogma/styler';
import { Store } from 'clashofclans.js';

import { RedisService } from '~/core/redis/redis.service';

// This service is just made for clashofclans caching. Maybe merge with redis service itself in future?
@Injectable()
export class CacheService implements Omit<Store, 'delete' | 'clear'> {
    public constructor(@OgmaLogger(CacheService) private readonly logger: OgmaService, private readonly redisService: RedisService) {}

    private redis = this.redisService.redisClient;

    public async set(key: string, value: string, ttl = 0) {
        await this.redis.set(key, JSON.stringify(value), { PX: ttl });

        this.logger.debug(
            `${style.green.bold.apply('Cached Data')} | 
            ${style.yellow.bold.apply('KEY:')} ${key} | 
            ${style.red.bold.apply('EXPIRY:')} ${ttl} | 
            ${style.blue.bold.apply('VALUE:')} 
            ${JSON.stringify(value).substring(0, 40)} ...`.replace(/\n|\r|\s+/g, ' ')
        );
        return true;
    }

    public async get(key: string) {
        const data = await this.redis.get(key);
        if (data === null) return null;

        this.logger.debug(
            `${style.color(214).bold.apply('Returning Cached Data')} | 
            ${style.yellow.bold.apply('KEY:')} ${key} | 
            ${style.blue.bold.apply('DATA:')} ${data.substring(0, 40)} ...`.replace(/\n|\r|\s+/g, ' ')
        );
        return JSON.parse(data);
    }
}
