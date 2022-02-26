import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from 'src/core/config/config.module';
import { LoggingModule } from 'src/core/logging/logging.module';

import { AppConfig } from '~/core/config/env.getters';
import { DatabaseSession, User } from '~/database';

import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';

@Global()
@Module({
    imports: [ConfigModule, LoggingModule, TypeOrmModule.forFeature([DatabaseSession, User])],
    controllers: [DiscordController],
    providers: [AppConfig, DiscordService],
    exports: [AppConfig, DiscordService]
})
export class DiscordModule {}
