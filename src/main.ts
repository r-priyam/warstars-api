import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '~/app.module';
import { Logger } from '~/util/Logger';

async function main() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
		bufferLogs: true,
	});
	app.useGlobalPipes(new ValidationPipe());
	app.useLogger(new Logger());
	await app.listen(3000);
	new Logger('MAIN').info(`Application is running on: ${await app.getUrl()}`);
}
main();
