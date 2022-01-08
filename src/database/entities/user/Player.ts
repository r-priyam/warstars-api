import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'user_player' })
@Unique('user_players_unique_tag', ['userId', 'playerTag'])
export class UserPlayer {
	@PrimaryGeneratedColumn()
	id: number;

	@Index('index_user_player_user_id')
	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'player_tag' })
	playerTag: string;

	@Column('timestamp without time zone', { name: 'start_time', default: () => 'now()' })
	linkedAt?: Date;
}
