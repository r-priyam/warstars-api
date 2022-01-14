import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'child_league' })
@Index('child_league_id_pkey', ['id'], { unique: true })
@Unique('unique_child_league', ['leagueId', 'abbreviation'])
export class ChildLeague {
	@PrimaryGeneratedColumn()
	id: number;

	@Index('index_child_league_leagueid')
	@Column({ name: 'league_id' })
	leagueId: number;

	@Column({ name: 'name', type: 'text' })
	name: string;

	@Column({ type: 'varchar', length: 10 })
	abbreviation: string;

	@Column({ name: 'icon_url', type: 'text' })
	iconUrl: string;
}
