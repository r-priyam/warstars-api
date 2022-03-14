import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';
import { ConfigModule } from 'src/core/config/config.module';

import { OgmaModuleConfig } from '../logging/OgmaConfig';

@Module({
    imports: [OgmaModule.forRootAsync({ useClass: OgmaModuleConfig, imports: [ConfigModule] })]
})
export class LoggingModule {}
