import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig {
	constructor(private configService: ConfigService) {}

	get isDevelopment(): boolean {
		return this.configService.get('ENV') === 'development';
	}

	get appName(): string {
		return this.configService.get('APP_NAME');
	}

	get port(): number {
		return this.configService.get('PORT');
	}

	get host(): string {
		return this.configService.get('HOST');
	}

	get corsOrigins(): string[] {
		return this.configService.get('CORS_ORIGINS').split(', ');
	}

	get cookieSignSecret(): string {
		return this.configService.get('COOKIE_SECRET');
	}

	get database(): {
		host: string;
		port: number;
		user: string;
		password: string;
		name: string;
	} {
		return {
			host: this.configService.get('DATABASE_HOST'),
			port: parseInt(this.configService.get('DATABASE_PORT'), 10),
			user: this.configService.get('DATABASE_USER'),
			password: this.configService.get('DATABASE_PASSWORD'),
			name: this.configService.get('DATABASE_NAME')
		};
	}
}
