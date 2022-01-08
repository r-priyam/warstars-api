import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('league_scehdule_pkey', ['id'], { unique: true })
@Entity('league_scehdule', { schema: 'public' })
export class LeagueScehdule {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('integer', { name: 'league_id', nullable: true })
	leagueId: number | null;

	@Column('text', { name: 'sub_league_id', nullable: true })
	subLeagueId: string | null;

	@Column('integer', { name: 'season_id', nullable: true })
	seasonId: number | null;

	@Column('integer', { name: 'week', nullable: true })
	week: number | null;

	@Column('timestamp without time zone', { name: 'start_date', nullable: true })
	startDate: Date | null;

	@Column('timestamp without time zone', { name: 'end_date', nullable: true })
	endDate: Date | null;

	@Column('boolean', { name: 'bye_week', default: () => 'false' })
	byeWeek: boolean;
}
