import * as rfs from 'rotating-file-stream';
import { Injectable } from '@nestjs/common';
import { FastifyParser } from '@ogma/platform-fastify';
import type { OgmaModuleOptions } from '@ogma/nestjs-module';
import type { ModuleConfigFactory } from '@golevelup/nestjs-modules';

import type { AppConfig } from '../config/env.getters';
import { generateLogFilename } from './LogName';

@Injectable()
export class OgmaModuleConfig implements ModuleConfigFactory<OgmaModuleOptions> {
    constructor(private readonly config: AppConfig) {}

    createModuleConfig(): OgmaModuleOptions {
        return {
            service: {
                color: this.config.isDevelopment,
                application: this.config.appName,
                stream: rfs.createStream(generateLogFilename, {
                    interval: '1d',
                    path: './logs',
                    teeToStdout: true
                })
            },
            interceptor: {
                http: FastifyParser
            }
        };
    }
}
