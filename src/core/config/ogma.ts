import * as rfs from 'rotating-file-stream';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FastifyParser } from '@ogma/platform-fastify';
import { OgmaModuleOptions } from '@ogma/nestjs-module';
import { ModuleConfigFactory } from '@golevelup/nestjs-modules';
import { generateLogFilename } from '~/util/LogName';

@Injectable()
export class OgmaModuleConfig implements ModuleConfigFactory<OgmaModuleOptions> {
	constructor(private readonly configService: ConfigService) {}

	createModuleConfig(): OgmaModuleOptions {
		return {
			service: {
				color: this.configService.get('env') === 'DEV',
				application: 'WarStars',
				stream: rfs.createStream(generateLogFilename, {
					interval: '1d',
					path: './logs',
					teeToStdout: this.configService.get('env') === 'DEV'
				})
			},
			interceptor: {
				http: FastifyParser
			}
		};
	}
}
