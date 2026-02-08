import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FilmEntity } from './film.entity';

@Entity('schedules')
export class ScheduleEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  daytime: string;

  @Column()
  hall: number;

  @Column()
  rows: number;

  @Column()
  seats: number;

  @Column()
  price: number;

  @Column('text', { default: '' })
  taken: string;

  @ManyToOne(() => FilmEntity, (f) => f.schedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'filmId' })
  film: FilmEntity;
}
