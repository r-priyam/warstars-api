import { BigIntType, Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class User {
	@PrimaryKey({ type: BigIntType })
	id: string;

	@Property({ name: 'discord_id' })
	discordId: string;

	@Property({ name: 'user_name' })
	@Unique()
	username: string;

	@Property()
	discriminator: string;

	@Property()
	email: string;

	@Property({ nullable: true })
	avatar: string;

	@Property({ name: 'access_token' })
	accessToken: string;

	@Property({ name: 'refresh_token' })
	refreshToken: string;

	@Property()
	createdAt = new Date();
}
