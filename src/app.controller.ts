import { Controller, Get } from '@nestjs/common';
import { Logger } from '~/util/Logger';

@Controller()
export class AppController {
	private readonly logger = new Logger('ABC');

	@Get()
	getMain() {
		this.logger.info('Test');
		return 'Welcome to WarStars API';
	}
}
