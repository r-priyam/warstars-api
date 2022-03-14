import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OgmaInterceptor } from '@ogma/nestjs-module';

import { BotModule } from '~/core/bot/bot.module';
import { ClashModule } from '~/core/clash/clash.module';
import { ConfigModule } from '~/core/config/config.module';
import { AppConfig } from '~/core/config/env.getters';
import { LeaguePermission } from '~/core/guards/leaguepermissions.guard';
import { SessionGuard } from '~/core/guards/session.guard';
import { CachingInterceptor } from '~/core/interceptor/caching.interceptor';
import { ExceptionsFilter } from '~/core/logging/exception.filter';
import { LoggingModule } from '~/core/logging/logging.module';
import { RedisModule } from '~/core/redis/redis.module';
import { DatabaseModule } from '~/database/config/database.module';
import { AccountModule, DiscordModule, LeagueModule } from '~/routes';

import { AppController } from './app.controller';

@Module({
    imports: [
        ConfigModule,
        BotModule,
        ClashModule,
        LoggingModule,
        DatabaseModule,
        EventEmitterModule.forRoot(),
        DiscordModule,
        AccountModule,
        LeagueModule,
        RouterModule.register([
            {
                path: 'account',
                module: AccountModule
            },
            {
                path: 'league',
                module: LeagueModule
            }
        ]),
        RedisModule
    ],
    controllers: [AppController],
    providers: [
        AppConfig,
        {
            provide: APP_INTERCEPTOR,
            useClass: OgmaInterceptor
        },
        {
            provide: APP_FILTER,
            useClass: ExceptionsFilter
        },
        {
            provide: APP_GUARD,
            useClass: SessionGuard
        },
        {
            provide: APP_GUARD,
            useClass: LeaguePermission
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: CachingInterceptor
        }
    ],
    exports: [AppConfig]
})
export class AppModule {}
