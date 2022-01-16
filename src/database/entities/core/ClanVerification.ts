import { Column, Entity, Index } from 'typeorm';

@Index('clan_verification_abbreviation_key', ['abbreviation'], { unique: true })
@Entity('clan_verification', { schema: 'public' })
export class ClanVerification {
	@Column('text', { name: 'clan_name' })
	clanName: string;

	@Column('text', { primary: true, name: 'clan_tag' })
	clanTag: string;

	@Column('text', { name: 'abbreviation' })
	abbreviation: string;

	@Column('text', { name: 'label', nullable: true })
	label: string | null;

	@Column('boolean', { name: 'verified', default: () => 'false' })
	verified: boolean;

	@Column('timestamp without time zone', { name: 'verified_on', default: () => 'now()' })
	verifiedOn: Date;
}
