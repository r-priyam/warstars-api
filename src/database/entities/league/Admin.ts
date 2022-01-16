import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('league_admin', { schema: 'public' })
@Index('unique_league_admin_discord', ['discordId', 'leagueId'], { unique: true })
export class LeagueAdmin {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'discord_id' })
	discordId: string;

	@Column({ name: 'league_id' })
	leagueId: number;

	@Column()
	permissions: number;

	@Column('timestamp without time zone', { name: 'start_time', default: () => 'now()' })
	addedAt: Date;
}
