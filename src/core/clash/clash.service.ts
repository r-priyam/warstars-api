import { Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { BatchThrottler, Client } from 'clashofclans.js';

import { CacheService } from '~/core/redis/cache.service';

import { AppConfig } from '../config/env.getters';

@Injectable()
export class ClashService {
    constructor(
        @OgmaLogger(ClashService) private readonly logger: OgmaService,
        private readonly cache: CacheService,
        private readonly config: AppConfig
    ) {}

    private readonly client = new Client({
        // @ts-expect-error omitted store types
        cache: this.cache,
        retryLimit: 1,
        restRequestTimeout: 10000,
        throttler: new BatchThrottler(30)
    });

    public get clashClient() {
        return this.client;
    }

    public async init() {
        try {
            await this.client.login({
                email: this.config.clashConfig.email,
                password: this.config.clashConfig.password,
                keyName: this.config.clashConfig.keyName
            });
            this.logger.info('Clash API connection initialized');
        } catch (error) {
            this.logger.printError(error);
        }
    }
}
