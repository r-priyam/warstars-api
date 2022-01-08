import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('league_matches_pkey', ['warId'], { unique: true })
@Entity('league_matches', { schema: 'public' })
export class LeagueMatches {
	@PrimaryGeneratedColumn({ name: 'war_id' })
	warId: number;

	@Column('integer', { name: 'league_id', nullable: true })
	leagueId: number | null;

	@Column('text', { name: 'league_abbr', nullable: true })
	leagueAbbr: string | null;

	@Column('integer', { name: 'sub_league_id', nullable: true })
	subLeagueId: number | null;

	@Column('text', { name: 'sub_league_name', nullable: true })
	subLeagueName: string | null;

	@Column('integer', { name: 'season_id', nullable: true })
	seasonId: number | null;

	@Column('integer', { name: 'war_week', nullable: true })
	warWeek: number | null;

	@Column('text', { name: 'week_duration', nullable: true })
	weekDuration: string | null;

	@Column('date', { name: 'war_date', nullable: true })
	warDate: string | null;

	@Column('text', { name: 'clan_one_name', nullable: true })
	clanOneName: string | null;

	@Column('text', { name: 'clan_one_tag', nullable: true })
	clanOneTag: string | null;

	@Column('text', { name: 'clan_one_abbr', nullable: true })
	clanOneAbbr: string | null;

	@Column('text', { name: 'clan_two_name', nullable: true })
	clanTwoName: string | null;

	@Column('text', { name: 'clan_two_tag', nullable: true })
	clanTwoTag: string | null;

	@Column('text', { name: 'clan_two_abbr', nullable: true })
	clanTwoAbbr: string | null;

	@Column('timestamp without time zone', { name: 'start_time', nullable: true })
	startTime: Date | null;

	@Column('timestamp without time zone', { name: 'end_time', nullable: true })
	endTime: Date | null;

	@Column('boolean', { name: 'result', nullable: true, default: () => 'false' })
	result: boolean | null;
}
