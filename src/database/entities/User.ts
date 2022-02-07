import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users', { schema: 'public' })
@Index('index_user_discord_id', ['discordId'], { unique: true })
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column({ name: 'discord_id' })
	discordId: string;

	@Column({ name: 'user_name' })
	username: string;

	@Column()
	discriminator: string;

	@Column()
	email: string;

	@Column({ nullable: true })
	avatar: string;

	@Column({ name: 'access_token' })
	accessToken: string;

	@Column({ name: 'refresh_token' })
	refreshToken: string;

	@Column('timestamp without time zone', { name: 'created_at', default: () => 'now()' })
	createdAt?: Date;
}
