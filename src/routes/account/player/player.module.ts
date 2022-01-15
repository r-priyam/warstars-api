import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OgmaModule } from '@ogma/nestjs-module';
import { ClashModule } from '~/core/clash/clash.module';
import { UserPlayer } from '~/database';
import { PlayerController } from './player.contoller';
import { PlayerService } from './player.service';

@Module({
	imports: [ClashModule, OgmaModule.forFeature(PlayerService), TypeOrmModule.forFeature([UserPlayer])],
	controllers: [PlayerController],
	providers: [PlayerService]
})
export class PlayerModule {}
