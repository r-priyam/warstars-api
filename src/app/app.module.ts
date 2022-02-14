import { Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppConfig } from '~/core/config/env.getters';
import { ConfigModule } from '~/core/config/config.module';
import { LoggingModule } from '~/core/logging/logging.module';
import { DatabaseModule } from '~/database/config/database.module';
import { AccountModule, DiscordModule } from '~/routes';
import { ClashModule } from '~/core/clash/clash.module';
import { SessionGuard } from '~/core/guards/session.guard';
import { LeaguePermission } from '~/core/guards/leaguepermissions.guard';
import { LeagueModule } from '~/routes/league/league.module';
import { BotModule } from '~/core/bot/bot.module';

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
