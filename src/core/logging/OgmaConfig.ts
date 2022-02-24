import { createWriteStream } from 'fs';
import { Injectable } from '@nestjs/common';
import { FastifyParser } from '@ogma/platform-fastify';
import type { OgmaModuleOptions } from '@ogma/nestjs-module';
import type { ModuleConfigFactory } from '@golevelup/nestjs-modules';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AppConfig } from '../config/env.getters';

@Injectable()
export class OgmaModuleConfig implements ModuleConfigFactory<OgmaModuleOptions> {
    constructor(private readonly config: AppConfig) {}

    createModuleConfig(): OgmaModuleOptions {
        return {
            service: {
                color: this.config.isDevelopment,
                application: this.config.appName,
                stream: this.config.isDevelopment ? null : createWriteStream('./logs/app.log'),
                json: !this.config.isDevelopment
            },
            interceptor: {
                http: FastifyParser
            }
        };
    }
}
