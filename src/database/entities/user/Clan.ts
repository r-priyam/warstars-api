import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_clan', { schema: 'public' })
@Index('user_clan_unique_tag', ['discordId', 'clanTag'], { unique: true })
export class UserClan {
    @PrimaryGeneratedColumn()
    id: number;

    @Index('index_user_clan_discord_id')
    @Column({ name: 'discord_id' })
    discordId: string;

    @Column({ name: 'clan_tag' })
    clanTag: string;

    @Column('timestamp without time zone', { name: 'linked_at', default: () => 'now()' })
    linkedAt?: Date;
}
