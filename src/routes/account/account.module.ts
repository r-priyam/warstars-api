import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClashModule } from '~/core/clash/clash.module';
import { UserClan, UserPlayer } from '~/database';

import { ClanController } from './clan/clan.controller';
import { ClanService } from './clan/clan.service';
import { PlayerController } from './player/player.contoller';
import { PlayerService } from './player/player.service';

@Module({
    imports: [ClashModule, TypeOrmModule.forFeature([UserClan, UserPlayer])],
    controllers: [ClanController, PlayerController],
    providers: [ClanService, PlayerService]
})
export class AccountModule {}
