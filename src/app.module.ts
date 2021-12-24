import { Module } from '@nestjs/common';
import { AppController } from '~/app.controller';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger } from '~/util/Logger';

@Module({
	imports: [ConfigModule.forRoot({ envFilePath: '.env' }), MikroOrmModule.forRoot()],
	controllers: [AppController],
	providers: [Logger],
	exports: [Logger],
})
export class AppModule {}
