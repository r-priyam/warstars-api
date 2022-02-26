import { ModuleConfigFactory } from '@golevelup/nestjs-modules';
import { Injectable } from '@nestjs/common';
import { OgmaModuleOptions } from '@ogma/nestjs-module';
import { FastifyParser } from '@ogma/platform-fastify';
import { createWriteStream } from 'fs';

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
