import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('child_league_season_pkey', ['seasonId'], { unique: true })
@Entity('child_league_season', { schema: 'public' })
export class ChildLeagueSeason {
	@PrimaryGeneratedColumn({ name: 'season_id' })
	seasonId: number;

	@Column('integer', { name: 'league_season_id', default: () => '0' })
	leagueSeasonId: number;

	@Column('integer', { name: 'league_id' })
	leagueId: number;

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
