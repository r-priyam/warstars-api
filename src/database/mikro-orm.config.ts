import { Options } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Logger as CustomLogger } from '~/util/Logger';

const config: Options = {
	type: 'postgresql',
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	dbName: process.env.DB_NAME,
	entities: ['dist/**/*.entity.js'],
	entitiesTs: ['src/**/*.entity.ts'],
	debug: process.env.ENVIRONMENT === 'TEST',
	highlighter: new SqlHighlighter(),
	metadataProvider: TsMorphMetadataProvider,
	pool: { min: 10, max: 10 },
	logger: (msg) => new CustomLogger('DATABASE').info(msg),
};

export default config;
