import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BotModule } from '~/core/bot/bot.module';
import { ClashModule } from '~/core/clash/clash.module';
import { ConfigModule } from '~/core/config/config.module';
import { AppConfig } from '~/core/config/env.getters';
import { LoggingModule } from '~/core/logging/logging.module';
import {
    ChildLeague,
    ChildLeagueSeason,
    DatabaseSession,
    Division,
    League,
    LeagueAdmin,
    LeagueClan,
    LeagueSeason,
    User,
    UserClan,
    UserPlayer
} from '~/database';

import { ClanController } from './account/clan/clan.controller';
import { ClanService } from './account/clan/clan.service';
import { PlayerController } from './account/player/player.contoller';
import { PlayerService } from './account/player/player.service';
import { DiscordController } from './discord/discord.controller';
import { DiscordService } from './discord/discord.service';
import { AdminController } from './league/admin/admin.controller';
import { AdminService } from './league/admin/admin.service';
import { CoreController } from './league/core/core.controller';
import { CoreService } from './league/core/core.service';
import { RegisterController } from './league/register/register.controller';
import { RegisterService } from './league/register/register.service';
import { LeagueRegisterListener } from './league/register/register-event.listener';
import { SeasonController } from './league/season/season.controller';
import { SeasonService } from './league/season/season.service';

const ACCOUNT_MODULE = {
    imports: [ClashModule],
    controllers: [ClanController, PlayerController],
    providers: [ClanService, PlayerService],
    exports: [],
    entities: [UserClan, UserPlayer]
};
const DISCORD_MODULE = {
    imports: [ConfigModule, LoggingModule],
    controllers: [DiscordController],
    providers: [AppConfig, DiscordService],
    exports: [AppConfig, DiscordService],
    entities: [DatabaseSession, User]
};
const LEAGUE_MODULE = {
    imports: [ClashModule, BotModule],
    controllers: [AdminController, CoreController, RegisterController, SeasonController],
    providers: [AdminService, CoreService, RegisterService, SeasonService, LeagueRegisterListener],
    exports: [CoreService],
    entities: [LeagueAdmin, League, ChildLeague, Division, LeagueSeason, ChildLeagueSeason, LeagueClan, User]
};

@Module({
    imports: [
        ...new Set([...ACCOUNT_MODULE.imports, ...DISCORD_MODULE.imports, ...LEAGUE_MODULE.imports]),
        TypeOrmModule.forFeature([...new Set([...ACCOUNT_MODULE.entities, ...DISCORD_MODULE.entities, ...LEAGUE_MODULE.entities])])
    ],
    controllers: [...ACCOUNT_MODULE.controllers, ...DISCORD_MODULE.controllers, ...LEAGUE_MODULE.controllers],
    providers: [...ACCOUNT_MODULE.providers, ...DISCORD_MODULE.providers, ...LEAGUE_MODULE.providers],
    exports: [...ACCOUNT_MODULE.exports, ...DISCORD_MODULE.exports, ...LEAGUE_MODULE.exports]
})
export class RoutesModule {}
