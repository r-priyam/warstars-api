import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';

import { CacheService } from './cache.service';
import { RedisService } from './redis.service';

@Module({
    imports: [OgmaModule.forFeatures([CacheService, RedisService])],
    providers: [RedisService, CacheService],
    exports: [RedisService, CacheService]
})
export class RedisModule {}
