import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '~/core/config/config.module';

import { TypeOrmConfig } from './TypeOrmConfig';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfig,
            imports: [ConfigModule]
        })
    ]
})
export class DatabaseModule {}
