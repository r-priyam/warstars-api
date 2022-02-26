import { Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AppConfig } from '../config/env.getters';
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
        await this.client.start(this.config.botToken);
    }
}
