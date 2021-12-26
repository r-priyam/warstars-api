import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '~/app.module';
import { OgmaService } from '@ogma/nestjs-module';
import { ConfigService } from '@nestjs/config';

async function main() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
		bufferLogs: true,
		logger: false,
	});
	app.useGlobalPipes(new ValidationPipe());
	const config = app.get(ConfigService);
	const logger = app.get<OgmaService>(OgmaService);
	app.useLogger(logger);
	await app.listen(config.get<number>('PORT'));
	logger.info(`Application is running on: ${await app.getUrl()}`, 'MAIN');
}
main();
