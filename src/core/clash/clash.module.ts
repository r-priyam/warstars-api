import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';

import { CacheService } from '~/core/redis/cache.service';
import { RedisModule } from '~/core/redis/redis.module';

import { ClashService } from './clash.service';

@Module({
    imports: [RedisModule, OgmaModule.forFeatures([ClashService, CacheService])],
    providers: [ClashService, CacheService],
    exports: [ClashService]
})
export class ClashModule {}
