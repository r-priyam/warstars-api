import { Module } from '@nestjs/common';
import { AppController } from '~/app.controller';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OgmaInterceptor, OgmaModule } from '@ogma/nestjs-module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionFilter } from '~/exception.filter';
import { OgmaModuleConfig } from '~/core/config/ogma';
import { MikroOrmModuleConfig } from '~/database/mikro-orm.config';
import configuration from '~/core/config/configuration';

@Module({
	imports: [
		ConfigModule.forRoot({ load: [configuration], cache: true, isGlobal: true }),
		MikroOrmModule.forRootAsync({ useClass: MikroOrmModuleConfig }),
		OgmaModule.forRootAsync({ useClass: OgmaModuleConfig, imports: [ConfigModule] }),
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: OgmaInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: ExceptionFilter,
		},
	],
	exports: [MikroOrmModule],
})
export class AppModule {}
