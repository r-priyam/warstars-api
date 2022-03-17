import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';

import { CacheService } from '~/core/redis/cache.service';
import { RedisModule } from '~/core/redis/redis.module';

import { ConfigModule } from '../config/config.module';
import { AppConfig } from '../config/env.getters';
import { ClashService } from './clash.service';

@Module({
    imports: [RedisModule, ConfigModule, OgmaModule.forFeatures([ClashService, CacheService])],
    providers: [AppConfig, ClashService, CacheService],
    exports: [ClashService]
})
export class ClashModule {}
