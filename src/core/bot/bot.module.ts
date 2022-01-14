import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';
import { BotService } from './bot.service';

@Module({ imports: [OgmaModule.forFeature(BotService)], providers: [BotService], exports: [BotService] })
export class BotModule {}
