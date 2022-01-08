import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('league_clan_league_id_child_id_division_id_child_season_id__key', ['childId', 'childSeasonId', 'divisionId', 'leagueId', 'tag'], {
	unique: true
})
@Entity('league_clan', { schema: 'public' })
export class LeagueClan {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('integer', { name: 'league_id', nullable: true, unique: true })
	leagueId: number | null;

	@Column('integer', { name: 'child_id', nullable: true, unique: true })
	childId: number | null;

	@Column('integer', { name: 'division_id', nullable: true, unique: true })
	divisionId: number | null;

	@Column('integer', { name: 'league_season_id', nullable: true })
	leagueSeasonId: number | null;

	@Column('integer', { name: 'child_season_id', nullable: true, unique: true })
	childSeasonId: number | null;

	@Column('text', { name: 'name', nullable: true })
	name: string | null;

	@Column('text', { name: 'tag', nullable: true, unique: true })
	tag: string | null;
}
