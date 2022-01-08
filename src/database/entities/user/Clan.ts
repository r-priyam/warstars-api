import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'user_clan' })
@Unique('user_clan_unique_tag', ['userId', 'clanTag'])
export class UserClan {
	@PrimaryGeneratedColumn()
	id: number;

	@Index()
	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'clan_tag' })
	clanTag: string;

	@Column('timestamp without time zone', { name: 'start_time', default: () => 'now()' })
	linkedAt?: Date;
}
