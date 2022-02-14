import { Module } from '@nestjs/common';
import { ClashModule } from '~/core/clash/clash.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildLeague, ChildLeagueSeason, Division, League, LeagueAdmin, LeagueClan, LeagueSeason } from '~/database';
import { OgmaModule } from '@ogma/nestjs-module';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { CoreController } from './core/core.controller';
import { CoreService } from './core/core.service';
import { RegisterService } from './register/register.service';
import { RegisterController } from './register/register.controller';
import { SeasonController } from './season/season.controller';
import { SeasonService } from './season/season.service';
import { ConfigModule } from '~/core/config/config.module';
import { AppConfig } from '~/core/config/env.getters';
import { LeagueRegisterListener } from './register/register-event.listener';
import { BotModule } from '~/core/bot/bot.module';

@Module({
    imports: [
        ClashModule,
        BotModule,
        OgmaModule.forFeatures([AdminService, CoreService, RegisterService, SeasonService]),
        TypeOrmModule.forFeature([LeagueAdmin, League, ChildLeague, Division, LeagueSeason, ChildLeagueSeason, LeagueClan]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: AppConfig) => ({
                secret: config.jwtSecret
            }),
            inject: [AppConfig]
        })
    ],
    controllers: [AdminController, CoreController, RegisterController, SeasonController],
    providers: [AdminService, CoreService, RegisterService, SeasonService, LeagueRegisterListener]
})
export class LeagueModule {}
