import { Controller, Get } from '@nestjs/common';
import { Logger } from '~/util/Logger';

@Controller()
export class AppController {
	private readonly logger = new Logger();

	@Get()
	getMain() {
		this.logger.log(`Ready`, { label: AppController.name });
		return 'Welcome to WarStars API';
	}
}
