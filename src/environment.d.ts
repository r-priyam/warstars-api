declare namespace NodeJS {
	export interface ProcessEnv {
		ENVIRONMENT: Environment;
		DB_HOST: string;
		DB_PORT: number;
		DB_USER: string;
		DB_PASSWORD: string;
		DB_NAME: string;
		PORT: number;
	}
	export type Environment = 'DEV' | 'PROD' | 'TEST';
}
