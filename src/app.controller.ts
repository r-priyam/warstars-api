import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
	@Get()
	getMain() {
		return 'Welcome to WarStars API';
	}
}
