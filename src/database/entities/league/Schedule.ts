import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// TODO: better column uniqueness
@Entity('league_scehdule', { schema: 'public' })
export class LeagueScehdule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('integer', { name: 'league_id' })
    leagueId: number;

    @Column('integer', { name: 'child_league_id' })
    childLeagueId: number;

    @Column('integer', { name: 'season_id' })
    seasonId: number;

    @Column('integer', { name: 'week' })
    week: number;

    @Column('timestamp without time zone', { name: 'start_date', nullable: true })
    startDate: Date | null;

    @Column('timestamp without time zone', { name: 'end_date', nullable: true })
    endDate: Date | null;

    @Column('boolean', { name: 'bye_week', default: () => 'false' })
    byeWeek: boolean;
}
