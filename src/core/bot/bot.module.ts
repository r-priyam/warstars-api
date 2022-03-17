import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';

import { ConfigModule } from '../config/config.module';
import { AppConfig } from '../config/env.getters';
import { BotService } from './bot.service';

@Module({ imports: [ConfigModule, OgmaModule.forFeature(BotService)], providers: [AppConfig, BotService], exports: [BotService] })
export class BotModule {}
