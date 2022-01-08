import { Injectable } from '@nestjs/common';
import { OgmaLogger, OgmaService } from '@ogma/nestjs-module';
import { BatchThrottler, Client } from 'clashofclans.js';
import { AppConfig } from '../config/env.getters';

@Injectable()
export class ClashService {
	constructor(@OgmaLogger(ClashService) private readonly logger: OgmaService, private readonly config: AppConfig) {
		this.client.on('maintenanceStart', () => {
			this.logger.info('Maintenance started!');
		});

		this.client.on('maintenanceEnd', (duration) => {
			this.logger.info(`Maintenance ended! Duration: ${duration}`);
		});

		this.client.on('newSeasonStart', (id) => {
			this.logger.info(`New season started!, ID: ${id}`);
		});
	}
	private readonly client = new Client({
		cache: true,
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
			await this.client.events.init();
			this.logger.info('Clash API connection initialized');
		} catch (error) {
			this.logger.printError(error);
		}
	}
}
