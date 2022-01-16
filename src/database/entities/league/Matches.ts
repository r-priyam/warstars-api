import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// TODO: Better column indexes
@Entity('league_matches', { schema: 'public' })
export class LeagueMatches {
	@PrimaryGeneratedColumn({ name: 'war_id' })
	warId: number;

	@Column('integer', { name: 'league_id' })
	leagueId: number;

	@Column('text', { name: 'league_abbr' })
	leagueAbbr: string;

	@Column('integer', { name: 'child_league_id' })
	childLeagueId: number;

	@Column('text', { name: 'sub_league_name' })
	childLeagueName: string;

	@Column('integer', { name: 'season_id' })
	seasonId: number;

	@Column('integer', { name: 'war_week' })
	warWeek: number;

	@Column('text', { name: 'week_duration' })
	weekDuration: string | null;

	@Column('date', { name: 'war_date', nullable: true })
	warDate: string | null;

	@Column('text', { name: 'clan_one_name' })
	clanOneName: string;

	@Column('text', { name: 'clan_one_tag' })
	clanOneTag: string;

	@Column('text', { name: 'clan_one_abbr', nullable: true })
	clanOneAbbr: string | null;

	@Column('text', { name: 'clan_two_name' })
	clanTwoName: string;

	@Column('text', { name: 'clan_two_tag' })
	clanTwoTag: string;

	@Column('text', { name: 'clan_two_abbr', nullable: true })
	clanTwoAbbr: string | null;

	@Column('timestamp without time zone', { name: 'start_time', nullable: true })
	startTime: Date | null;

	@Column('timestamp without time zone', { name: 'end_time', nullable: true })
	endTime: Date | null;

	@Column('boolean', { name: 'result', default: () => 'false' })
	result: boolean;
}
