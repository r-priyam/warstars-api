import { Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfig } from '../core/config/env.getters';
import { ConfigModule } from 'src/core/config/config.module';
import { LoggingModule } from 'src/core/logging/logging.module';
import { DatabaseModule } from '~/database/config/database.module';
import { ClanModule, DiscordModule, PlayerModule } from '~/routes';
import { ClashModule } from '~/core/clash/clash.module';
import { SessionGuard } from '~/core/guards/session.guard';

@Module({
	imports: [
		ConfigModule,
		ClashModule,
		LoggingModule,
		DatabaseModule,
		DiscordModule,
		PlayerModule,
		ClanModule,
		RouterModule.register([
			{
				path: 'account',
				module: PlayerModule
			},
			{
				path: 'account',
				module: ClanModule
			}
		])
	],
	controllers: [AppController],
	providers: [AppConfig, AppService, { provide: APP_GUARD, useClass: SessionGuard }],
	exports: [AppConfig]
})
export class AppModule {}
