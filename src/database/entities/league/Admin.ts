import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'league_admin' })
@Unique('unique_league_admin_discord', ['discordId', 'leagueId'])
export class LeagueAdmin {
	@PrimaryGeneratedColumn()
	id: number;

	@Index('index_admin_discord_id')
	@Column({ name: 'discord_id' })
	discordId: string;

	@Column({ name: 'league_id' })
	leagueId: number;

	@Column()
	permissions: number;

	@Column('timestamp without time zone', { name: 'start_time', default: () => 'now()' })
	addedAt?: Date;
}
