import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('division_child_id_season_id_abbreviation_key', ['abbreviation', 'childId', 'seasonId'], { unique: true })
@Entity('division', { schema: 'public' })
export class Division {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('integer', { name: 'league_id' })
	leagueId: number;

	@Column('integer', { name: 'child_id' })
	childId: number;

	@Column({ name: 'season_id' })
	seasonId: number;

	@Column('text')
	name: string;

	@Column('text', {})
	abbreviation: string;

	@Column('text', { name: 'icon_url', nullable: true })
	iconUrl: string | null;
}
