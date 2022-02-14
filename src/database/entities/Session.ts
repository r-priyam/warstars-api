import { ISession } from 'connect-typeorm';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'sessions' })
export class DatabaseSession implements ISession {
    @Index()
    @PrimaryColumn('text')
    id = '';

    @Column('bigint')
    expiredAt: number;

    @Column('text')
    json = '';
}
