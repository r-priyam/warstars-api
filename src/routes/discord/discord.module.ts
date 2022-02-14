import { Global, Module } from '@nestjs/common';

import { DiscordController } from './discord.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfig } from '~/core/config/env.getters';
import { ConfigModule } from 'src/core/config/config.module';
import { LoggingModule } from 'src/core/logging/logging.module';
import { DatabaseSession, User } from '~/database';
import { DiscordService } from './discord.service';

@Global()
@Module({
    imports: [ConfigModule, LoggingModule, TypeOrmModule.forFeature([DatabaseSession, User])],
    controllers: [DiscordController],
    providers: [AppConfig, DiscordService],
    exports: [AppConfig, DiscordService]
})
export class DiscordModule {}
