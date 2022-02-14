import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('league_clan_league_id_child_id_division_id_child_season_id__key', ['childId', 'childSeasonId', 'divisionId', 'leagueId', 'tag'], {
    unique: true
})
@Entity('league_clan', { schema: 'public' })
export class LeagueClan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('integer', { name: 'league_id' })
    leagueId: number;

    @Column('integer', { name: 'child_id' })
    childId: number;

    @Column('integer', { name: 'division_id', default: () => '0' })
    divisionId: number;

    @Column('integer', { name: 'league_season_id', default: () => '0' })
    leagueSeasonId: number;

    @Column('integer', { name: 'child_season_id' })
    childSeasonId: number;

    @Column('text', { name: 'name', nullable: true })
    name: string | null;

    @Column('text', { name: 'tag' })
    tag: string;
}
