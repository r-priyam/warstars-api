import { Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { style } from '@ogma/styler';
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

    public async set(key: string, ttl: number, value: string): Promise<boolean> {
        this.logger.debug(
            `${style.green.bold.apply('Caching Data')} | 
            ${style.yellow.bold.apply('KEY:')} ${key} | 
            ${style.red.bold.apply('ttl:')} ${ttl} | 
            ${style.blue.bold.apply('VALUE:')} 
            ${JSON.stringify(value).substring(0, 40)} ...`.replace(/\n|\r|\s+/g, ' ')
        );

        let success = true;
        try {
            if (!ttl) {
                await this.client.set(key, value);
            } else {
                await this.client.set(key, value, { EX: ttl });
            }
        } catch (_) {
            success = false;
        }
        return success;
    }

    public async get(key: string) {
        const data = await this.client.get(key);

        if (data === null) return null;

        this.logger.debug(
            `${style.color(214).bold.apply('Returning Cached Data')} | 
            ${style.yellow.bold.apply('KEY:')} ${key} | 
            ${style.blue.bold.apply('DATA:')} ${data.substring(0, 40)} ...`.replace(/\n|\r|\s+/g, ' ')
        );

        return JSON.parse(data);
    }
}
