import { Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { Client, Intents } from 'discord.js';
import { AppConfig } from '../config/env.getters';

@Injectable()
export class BotService {
	constructor(@OgmaLogger(BotService) private readonly logger: OgmaService, private readonly config: AppConfig) {
		this.client.on('ready', () => this.logger.info('API bot started successfully!'));
		this.client.on('error', (error) => this.logger.error(error));
		this.client.on('warn', (error) => this.logger.warn(error));
	}

	public readonly client = new Client({ intents: [Intents.FLAGS.GUILDS] });

	public async init() {
		this.client.login(this.config.botToken);
	}
}
