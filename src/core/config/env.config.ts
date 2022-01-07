import { IsEnum, IsNotEmpty, IsPort, IsString, Length } from 'class-validator';

enum Environment {
	DEVELOPMENT = 'development',
	PRODUCTION = 'production'
}

export class ConfigEnvironment {
	@IsEnum(Environment)
	ENV: Environment;

	@IsNotEmpty()
	@IsString()
	APP_NAME: string;

	@IsString()
	@IsPort()
	PORT: string;

	@IsNotEmpty()
	@IsString()
	HOST: string;

	@IsNotEmpty()
	@IsString()
	CORS_ORIGINS: string;

	@IsNotEmpty()
	@IsString()
	@Length(64)
	COOKIE_SECRET: string;

	@IsNotEmpty()
	@IsString()
	@Length(64)
	SESSION_COOKIE_SECRET: string;

	@IsNotEmpty()
	@IsString()
	DATABASE_HOST: string;

	@IsNotEmpty()
	@IsString()
	@IsPort()
	DATABASE_PORT: string;

	@IsNotEmpty()
	@IsString()
	DATABASE_USER: string;
	DATABASE_PASSWORD: string;
	DATABASE_NAME: string;

	@IsNotEmpty()
	@IsString()
	OAUTH_SUCCESS_REDIRECT: string;
	DISCORD_OAUTH_REDIRECT: string;
	DISCORD_OAUTH_CLIENT_ID: string;
	DISCORD_OAUTH_SECRET: string;
	DISCORD_REDIRECT_URL: string;
	DISCORD_TOKEN_ENCRYPT_SECRET: string;
	LOGOUT_REDIRECT_URL: string;
}
