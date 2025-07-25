import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('league_admin', { schema: 'public' })
@Index('unique_league_admin_discord', ['discordId', 'leagueId'], { unique: true })
export class LeagueAdmin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'discord_id' })
    discordId: string;

    @Column({ name: 'league_id' })
    leagueId: number;

    @Column()
    permissions: number;

    @Column('boolean', { name: 'head_admin', default: () => 'false' })
    headAdmin: boolean;

    @Column('timestamp without time zone', { name: 'added_at', default: () => 'now()' })
    addedAt: Date;
}
