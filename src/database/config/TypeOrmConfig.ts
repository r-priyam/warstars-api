import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { AppConfig } from '~/core/config/env.getters';
import { entities } from '~/database';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
	constructor(private readonly config: AppConfig) {}
	private readonly database = this.config.database;

	createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: 'postgres',
			host: this.database.host,
			port: this.database.port,
			username: this.database.user,
			password: this.database.password,
			database: this.database.name,
			entities: entities,
			synchronize: this.config.isDevelopment,
			extra: { min: 10, max: 20, idleTimeoutMillis: 0 }
		};
	}
}
