import { Global, Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from 'src/core/config/config.module';
import { LoggingModule } from 'src/core/logging/logging.module';
import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';
import { DatabaseSession, User } from '~/database';
import { AppConfig } from '~/core/config/env.getters';

@Global()
@Module({
    imports: [ConfigModule, LoggingModule, TypeOrmModule.forFeature([DatabaseSession, User])],
    controllers: [DiscordController],
    providers: [AppConfig, DiscordService],
    exports: [AppConfig, DiscordService]
})
export class DiscordModule {}
