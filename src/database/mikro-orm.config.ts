import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { MikroOrmModuleOptions, MikroOrmOptionsFactory } from '@mikro-orm/nestjs';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { OgmaService } from '@ogma/nestjs-module';

@Injectable()
export class MikroOrmModuleConfig implements MikroOrmOptionsFactory {
	constructor(private readonly configService: ConfigService, private readonly logger: OgmaService) {}

	createMikroOrmOptions(): MikroOrmModuleOptions {
		const database = this.configService.get('database');

		return {
			driver: PostgreSqlDriver,
			driverOptions: { connection: { timezone: '+05:30' } },
			dbName: database.name,
			user: database.user,
			host: database.host,
			password: database.password,
			port: database.port,
			registerRequestContext: false,
			entities: ['dist/**/*.entity.js'],
			entitiesTs: ['src/**/*.entity.ts'],
			debug: this.configService.get('env') === 'DEV',
			highlighter: new SqlHighlighter(),
			metadataProvider: TsMorphMetadataProvider,
			pool: { min: 10, max: 10 },
			logger: (msg) => this.logger.log(msg, 'DATABASE'),
		};
	}
}
