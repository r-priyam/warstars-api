import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfig } from '../core/config/env.getters';
import { ConfigModule } from 'src/core/config/config.module';
import { LoggingModule } from 'src/core/logging/logging.module';
import { DatabaseModule } from '~/database/config/database.module';
import { DiscordModule } from '~/routes';

@Module({
	imports: [ConfigModule, LoggingModule, DatabaseModule, DiscordModule],
	controllers: [AppController],
	providers: [AppConfig, AppService],
	exports: [AppConfig]
})
export class AppModule {}
