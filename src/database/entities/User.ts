import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column({ name: 'discord_id', unique: true })
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

	@Column('timestamp without time zone', { name: 'start_time', default: () => 'now()' })
	createdAt?: Date;
}
