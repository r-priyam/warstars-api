import { Column, Entity, Index } from 'typeorm';

@Index('clan_verification_abbreviation_key', ['abbreviation'], { unique: true })
@Index('clan_verification_pkey', ['clanTag'], { unique: true })
@Entity('clan_verification', { schema: 'public' })
export class ClanVerification {
	@Column('text', { name: 'clan_name', nullable: true })
	clanName: string | null;

	@Column('text', { primary: true, name: 'clan_tag' })
	clanTag: string;

	@Column('text', { name: 'abbreviation', nullable: true, unique: true })
	abbreviation: string | null;

	@Column('text', { name: 'label', nullable: true })
	label: string | null;

	@Column('boolean', {
		name: 'verified',
		nullable: true,
		default: () => 'false'
	})
	verified: boolean | null;

	@Column('timestamp without time zone', {
		name: 'verified_on',
		nullable: true,
		default: () => 'now()'
	})
	verifiedOn: Date | null;
}
