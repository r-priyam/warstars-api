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

	get cookieDomain(): string {
		return this.configService.get('COOKIE_DOMAIN') || 'localhost';
	}

	get cookieSignSecret(): string {
		return this.configService.get('COOKIE_SECRET');
	}

	get sessionCookieSecret(): string {
		return this.configService.get('SESSION_COOKIE_SECRET');
	}

	get jwtSecret(): string {
		return this.configService.get('JWT_SECRET');
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

	get discord() {
		return {
			clientId: this.configService.get('DISCORD_OAUTH_CLIENT_ID'),
			clientSecret: this.configService.get('DISCORD_OAUTH_SECRET'),
			redirectUrl: this.configService.get('DISCORD_REDIRECT_URL'), // redirect url where discord will shoot
			authRedirect: this.configService.get('DISCORD_OAUTH_REDIRECT'), // redirect to get authorize
			encryptSecret: this.configService.get('DATABASE_HOST'), // encrypt secret for tokens
			successRedirect: this.configService.get('OAUTH_SUCCESS_REDIRECT') // redirect url after oauth success
		};
	}

	get botToken() {
		return this.configService.get('BOT_TOKEN');
	}

	get logOutRedirectUrl(): string {
		return this.configService.get('LOGOUT_REDIRECT_URL');
	}

	get clashConfig() {
		return {
			email: this.configService.get('COC_EMAIL'),
			password: this.configService.get('COC_PASSWORD'),
			keyName: this.configService.get('COC_KEY_NAME')
		};
	}
}
