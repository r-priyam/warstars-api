import { Module } from '@nestjs/common';
import { ClashService } from './clash.service';

@Module({ providers: [ClashService] })
export class ClashModule {}
