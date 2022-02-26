import { Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { BotModule } from '~/core/bot/bot.module';
import { ClashModule } from '~/core/clash/clash.module';
import { ConfigModule } from '~/core/config/config.module';
import { AppConfig } from '~/core/config/env.getters';
import { LeaguePermission } from '~/core/guards/leaguepermissions.guard';
import { SessionGuard } from '~/core/guards/session.guard';
import { LoggingModule } from '~/core/logging/logging.module';
import { DatabaseModule } from '~/database/config/database.module';
import { AccountModule, DiscordModule } from '~/routes';
import { LeagueModule } from '~/routes/league/league.module';

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
        ])
    ],
    controllers: [AppController],
    providers: [AppConfig, { provide: APP_GUARD, useClass: SessionGuard }, { provide: APP_GUARD, useClass: LeaguePermission }],
    exports: [AppConfig]
})
export class AppModule {}
