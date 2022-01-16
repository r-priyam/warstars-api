import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('child_league_season')
export class ChildLeagueSeason {
	@PrimaryGeneratedColumn({ name: 'season_id' })
	seasonId: number;

	@Index('index_child_season_league_season_id')
	@Column('integer', { name: 'league_season_id', default: () => '0' })
	leagueSeasonId: number;

	@Index('index_child_season_league_id')
	@Column('integer', { name: 'league_id' })
	leagueId: number;

	@Index('index_child_season_child_league_id')
	@Column('integer', { name: 'child_league_id' })
	childLeagueId: number;

	@Column('integer', { name: 'specific_id', nullable: false })
	specificId: number;

	@Column('timestamp without time zone', { name: 'start_time', default: () => 'now()' })
	startTime: Date;

	@Column('timestamp without time zone', { name: 'end_time', nullable: true })
	endTime: Date | null;

	@Column('boolean', { name: 'is_active', default: () => 'false' })
	isActive: boolean;
}
