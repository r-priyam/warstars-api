import * as uid from 'uid-safe';
import { getRepository } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { TypeormStore } from 'connect-typeorm';
import { fastifyHelmet } from 'fastify-helmet';
import { OgmaService } from '@ogma/nestjs-module';
import fastifyCookie from 'fastify-cookie';
import fastifySession from '@fastify/session';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app/app.module';
import { DatabaseSession } from './database';
import { AppConfig } from './core/config/env.getters';

async function main() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
		bufferLogs: true,
		logger: false
	});

	const config = app.get(AppConfig);
	const logger = app.get<OgmaService>(OgmaService);
	const sessionStore = getRepository(DatabaseSession);

	app.useLogger(logger);
	await app.register(fastifyHelmet);
	app.enableCors({ origin: config.corsOrigins, credentials: true });
	app.register(fastifyCookie, { secret: [config.sessionCookieSecret, config.cookieSignSecret] });
	await app.register(fastifySession, {
		cookie: {
			maxAge: 60000 * 60 * 24 * 7,
			secure: !config.isDevelopment
		},
		secret: config.sessionCookieSecret,
		saveUninitialized: false,
		idGenerator: () => uid.sync(128),
		store: new TypeormStore().connect(sessionStore)
	});

	await app.listen(config.port, config.host);
	logger.info(`Application is running on: ${await app.getUrl()}`, { context: 'MAIN' });
}

main();
