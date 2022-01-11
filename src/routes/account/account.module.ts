import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OgmaModule } from '@ogma/nestjs-module';
import { ClashModule } from '~/core/clash/clash.module';
import { UserClan, UserPlayer } from '~/database';
import { ClanController } from './clan/clan.controller';
import { ClanService } from './clan/clan.service';
import { PlayerController } from './player/player.contoller';
import { PlayerService } from './player/player.service';

@Module({
	imports: [ClashModule, OgmaModule.forFeatures([ClanService, PlayerService]), TypeOrmModule.forFeature([UserClan, UserPlayer])],
	controllers: [ClanController, PlayerController],
	providers: [ClanService, PlayerService]
})
export class AccountModule {}
