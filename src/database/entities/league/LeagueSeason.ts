import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('league_season', { schema: 'public' })
export class LeagueSeason {
	@PrimaryGeneratedColumn({ name: 'season_id' })
	seasonId: number;

	@Index('index_league_id')
	@Column('integer', { name: 'league_id' })
	leagueId: number;

	@Column('integer', { name: 'specific_id' })
	specificId: number;

	@Column('timestamp without time zone', { name: 'start_time', default: () => 'now()' })
	startTime: Date;

	@Column('timestamp without time zone', { name: 'end_time' })
	endTime: Date;

	@Column('boolean', { name: 'is_active', default: () => 'false' })
	isActive: boolean;
}
