import { Injectable } from '@nestjs/common';
import type { OgmaService } from '@ogma/nestjs-module';
import { OgmaLogger } from '@ogma/nestjs-module';
import type { AppConfig } from '../config/env.getters';
import Client from './struct/Client';

@Injectable()
export class BotService {
    constructor(@OgmaLogger(BotService) private readonly logger: OgmaService, private readonly config: AppConfig) {
        this.client.on('ready', () => this.logger.info('API bot started successfully!'));
        this.client.on('error', (error) => this.logger.error(error));
        this.client.on('warn', (error) => this.logger.warn(error));
    }

    public readonly client = new Client();

    public async init() {
        this.client.start(this.config.botToken);
    }
}
