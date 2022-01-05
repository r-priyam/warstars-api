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
	DATABASE_HOST: string;

	@IsNotEmpty()
	@IsString()
	@IsPort()
	DATABASE_PORT: string;

	@IsNotEmpty()
	@IsString()
	DATABASE_USER: string;

	@IsNotEmpty()
	@IsString()
	DATABASE_PASSWORD: string;

	@IsNotEmpty()
	@IsString()
	DATABASE_NAME: string;
}
