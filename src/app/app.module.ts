import { Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfig } from '~/core/config/env.getters';
import { ConfigModule } from '~/core/config/config.module';
import { LoggingModule } from '~/core/logging/logging.module';
import { DatabaseModule } from '~/database/config/database.module';
import { ClanModule, DiscordModule, PlayerModule } from '~/routes';
import { ClashModule } from '~/core/clash/clash.module';
import { SessionGuard } from '~/core/guards/session.guard';
import { LeaguePermission } from '~/core/guards/leaguepermissions.guard';
import { LeagueModule } from '~/routes/league/league.module';

@Module({
	imports: [
		ConfigModule,
		ClashModule,
		LoggingModule,
		DatabaseModule,
		DiscordModule,
		PlayerModule,
		ClanModule,
		LeagueModule,
		RouterModule.register([
			{
				path: 'account',
				module: PlayerModule
			},
			{
				path: 'account',
				module: ClanModule
			},
			{
				path: 'league',
				module: LeagueModule
			}
		])
	],
	controllers: [AppController],
	providers: [AppConfig, AppService, { provide: APP_GUARD, useClass: SessionGuard }, { provide: APP_GUARD, useClass: LeaguePermission }],
	exports: [AppConfig]
})
export class AppModule {}
