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

export interface IRegisterLeague {
	name: string;
	abbreviation: string;
	headAdmin: string;
	discordId: string;
	iconUrl: string;
	discordInvite?: string;
	twitterHandle?: string;
	website?: string;
	rules?: string;
}

export interface IRegisterChildLeague {
	leagueId: number;
	name: string;
	abbreviation: string;
	iconUrl: string;
}

export interface IRegisterDivision {
	id: number;
	leagueId: number;
	childId: number;
	seasonId: number;
	name: string;
	abbreviation: string;
	iconUrl: string;
}

export interface INewLeagueSeason {
	leagueId: number;
	startTime: string;
	endTime: string;
	isActive: boolean | true;
	childData?: number[];
	specificId?: number;
}

export interface INewChildLeagueSeason {
	leagueSeasonId?: number;
	leagueId: number;
	childLeagueId: number;
	startTime: string;
	endTime: string;
	isActive: boolean | true;
	specificId?: number;
}

export interface IEndLeagueSeason {
	seasonId: number;
	leagueId: number;
}

export interface IEndChildSeason extends IEndLeagueSeason {
	childLeagueId: number;
}

export interface ISeasonAddClan {
	leagueId: number;
	childId: number;
	divisionId?: number;
	leagueSeasonId: number;
	childSeasonId: number;
	clanTags: string[];
}

export interface ISeasonRemoveClan {
	leagueId: number;
	childId: number;
	divisionId: number;
	leagueSeasonId: number;
	childSeasonId: number;
	tag: string;
}
