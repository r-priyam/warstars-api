import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OgmaModule } from '@ogma/nestjs-module';
import { ClashModule } from '~/core/clash/clash.module';
import { UserClan } from '~/database';
import { ClanController } from './clan.controller';
import { ClanService } from './clan.service';

@Module({
	imports: [ClashModule, OgmaModule.forFeature(ClanService), TypeOrmModule.forFeature([UserClan])],
	controllers: [ClanController],
	providers: [ClanService]
})
export class ClanModule {}
