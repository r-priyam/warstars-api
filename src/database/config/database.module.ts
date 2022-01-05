import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmConfig } from './TypeOrmConfig';
import { ConfigModule } from '~/core/config/config.module';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmConfig,
			imports: [ConfigModule]
		})
	]
})
export class DatabaseModule {}
