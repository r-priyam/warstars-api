import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('league_abbreviation_key', ['abbreviation'], { unique: true })
@Entity('league', { schema: 'public' })
export class League {
	@PrimaryGeneratedColumn({ type: 'integer', name: 'league_id' })
	leagueId: number;

	@Column('text', { name: 'name' })
	name: string;

	@Column('text', { name: 'abbreviation' })
	abbreviation: string;

	@Column('text', { name: 'head_admin' })
	headAdmin: string;

	@Column({ name: 'discord_id' })
	discordId: string;

	@Column('text', { name: 'icon_url', nullable: true })
	iconUrl: string;

	@Column('text', { name: 'discord_invite', nullable: true })
	discordInvite: string | null;

	@Column('text', { name: 'twitter_handle', nullable: true })
	twitterHandle: string | null;

	@Column('text', { name: 'website', nullable: true })
	website: string | null;

	@Column('text', { name: 'rules', nullable: true })
	rules: string | null;

	@Column('text', { name: 'description', default: () => "'No description provided yet from the league side.'" })
	description: string;

	@Column('boolean', { name: 'is_verified', default: () => 'false' })
	isVerified: boolean;

	@Column('timestamp without time zone', { name: 'registerd_on', default: () => 'now()' })
	registerdOn: Date;
}
