import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('league_leader_board', { schema: 'public' })
export class LeagueLeaderBoard {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('integer', { name: 'season_id', nullable: true })
	seasonId: number | null;

	@Column('text', { name: 'clan_tag', nullable: true })
	clanTag: string | null;

	@Column('text', { name: 'abbreviation', nullable: true })
	abbreviation: string | null;

	@Column('integer', { name: 'stars', nullable: true })
	stars: number | null;

	@Column('integer', { name: 'attacks', nullable: true })
	attacks: number | null;

	@Column('numeric', { name: 'destruction', nullable: true })
	destruction: string | null;

	@Column('integer', { name: 'win', nullable: true, default: () => '0' })
	win: number | null;

	@Column('integer', { name: 'lose', nullable: true, default: () => '0' })
	lose: number | null;

	@Column('integer', { name: 'draw', nullable: true, default: () => '0' })
	draw: number | null;
}
