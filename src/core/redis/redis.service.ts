import { Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
    constructor(@OgmaLogger(RedisService) private readonly logger: OgmaService) {
        this.client.on('connect', () => this.logger.info('Connection initialized', 'REDIS'));
        this.client.on('error', (error) => this.logger.error(error, 'REDIS'));
        this.client.on('reconnecting', () => this.logger.warn('Attempting reconnect', 'REDIS'));
    }

    private readonly client = createClient({ url: 'redis://:@redis:6379' });

    public get redisClient() {
        return this.client;
    }

    public async init() {
        await this.client.connect();
    }

    public async set(key: string, value: string, expiry?: number) {
        if (!expiry) await this.client.set(key, value);
        await this.client.set(key, value, { EX: expiry });
    }

    public async get(key: string) {
        const data = await this.client.get(key);

        if (data === null) return null;
        else return JSON.parse(data);
    }
}
