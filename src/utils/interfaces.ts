export interface ICredentialsResponse {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	token_type: string;
}

export interface IDiscordUser {
	id: string;
	username: string;
	avatar: string;
	discriminator: string;
	email?: string;
	verified?: boolean;
	public_flags: number;
	flags: number;
	banner: string | null;
	banner_color: string | null;
	accent_color: string | null;
	locale: string;
	mfa_enabled: boolean;
}

export interface IDiscordUserGuild {
	id: string;
	name: string;
	icon: string | null;
	owner: boolean;
	permissions: number;
	features: string[];
	permissions_new: string;
}

export interface ICreateUser {
	discordId: string;
	username: string;
	discriminator: string;
	email: string;
	avatar: string;
	accessToken: string;
	refreshToken: string;
}

export interface IEncryptedTokens {
	accessToken: string;
	refreshToken: string;
}
