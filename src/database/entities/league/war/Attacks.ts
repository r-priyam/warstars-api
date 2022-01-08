import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('league_war_attacks', { schema: 'public' })
export class LeagueWarAttacks {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: 'war_id', nullable: true })
	warId: number;

	@Column('text', { name: 'clan_tag', nullable: true })
	clanTag: string | null;

	@Column('text', { name: 'opponent_tag', nullable: true })
	opponentTag: string | null;

	@Column('text', { name: 'attacker_name', nullable: true })
	attackerName: string | null;

	@Column('text', { name: 'attacker_tag', nullable: true })
	attackerTag: string | null;

	@Column('integer', { name: 'attacker_town_hall', nullable: true })
	attackerTownHall: number | null;

	@Column('integer', { name: 'attacker_map_position', nullable: true })
	attackerMapPosition: number | null;

	@Column('text', { name: 'defender_name', nullable: true })
	defenderName: string | null;

	@Column('text', { name: 'defender_tag', nullable: true })
	defenderTag: string | null;

	@Column('integer', { name: 'defender_town_hall', nullable: true })
	defenderTownHall: number | null;

	@Column('integer', { name: 'defender_map_position', nullable: true })
	defenderMapPosition: number | null;

	@Column('integer', { name: 'attack_order', nullable: true })
	attackOrder: number | null;

	@Column('integer', { name: 'stars', nullable: true })
	stars: number | null;

	@Column('numeric', { name: 'desturction', nullable: true })
	desturction: string | null;

	@Column('integer', { name: 'stars_earned', nullable: true })
	starsEarned: number | null;
}
