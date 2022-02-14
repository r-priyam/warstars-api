import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_player', { schema: 'public' })
@Index('user_players_unique_tag', ['discordId', 'playerTag'], { unique: true })
export class UserPlayer {
    @PrimaryGeneratedColumn()
    id: number;

    @Index('index_user_player_discord_id')
    @Column({ name: 'discord_id' })
    discordId: string;

    @Column({ name: 'player_tag' })
    playerTag: string;

    @Column('timestamp without time zone', { name: 'linked_at', default: () => 'now()' })
    linkedAt?: Date;
}
