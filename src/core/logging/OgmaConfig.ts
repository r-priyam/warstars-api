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
        const config = { color: this.config.isDevelopment, application: this.config.appName, json: !this.config.isDevelopment };
        return {
            service: this.config.isDevelopment ? config : { ...config, stream: createWriteStream('./logs/app.log') },
            interceptor: {
                http: FastifyParser
            }
        };
    }
}
