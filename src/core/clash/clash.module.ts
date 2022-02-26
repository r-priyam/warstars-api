import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';

import { ClashService } from './clash.service';

@Module({ imports: [OgmaModule.forFeature(ClashService)], providers: [ClashService], exports: [ClashService] })
export class ClashModule {}
