import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BotModule } from '~/core/bot/bot.module';
import { ClashModule } from '~/core/clash/clash.module';
import { ChildLeague, ChildLeagueSeason, Division, League, LeagueAdmin, LeagueClan, LeagueSeason, User } from '~/database';

import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { CoreController } from './core/core.controller';
import { CoreService } from './core/core.service';
import { RegisterController } from './register/register.controller';
import { RegisterService } from './register/register.service';
import { LeagueRegisterListener } from './register/register-event.listener';
import { SeasonController } from './season/season.controller';
import { SeasonService } from './season/season.service';

@Module({
    imports: [
        ClashModule,
        BotModule,
        TypeOrmModule.forFeature([LeagueAdmin, League, ChildLeague, Division, LeagueSeason, ChildLeagueSeason, LeagueClan, User])
    ],
    controllers: [AdminController, CoreController, RegisterController, SeasonController],
    providers: [AdminService, CoreService, RegisterService, SeasonService, LeagueRegisterListener],
    exports: [CoreService]
})
export class LeagueModule {}
