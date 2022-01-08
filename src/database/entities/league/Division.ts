import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('division_child_id_season_id_abbreviation_key', ['abbreviation', 'childId', 'seasonId'], { unique: true })
@Index('division_pkey', ['id'], { unique: true })
@Entity('division', { schema: 'public' })
export class Division {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('integer', { name: 'league_id', nullable: true })
	leagueId: number | null;

	@Column('integer', { name: 'child_id', nullable: true, unique: true })
	childId: number | null;

	@Column({ name: 'season_id', unique: true })
	seasonId: number;

	@Column('text')
	name: string | null;

	@Column('text', { unique: true })
	abbreviation: string;

	@Column('text', { name: 'icon_url', nullable: true })
	iconUrl: string | null;
}
