import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilmEntity } from '../schemas/Film.entity';
import { Repository } from 'typeorm';
import { ScheduleEntity } from 'src/films/schemas/Schedule.entity';
import { FilmDto, ScheduleDto } from 'src/films/dto/films.dto';

export interface IFilmsRepository {
  findAll(): Promise<FilmDto[]>;
  findScheduleById(filmId: string): Promise<ScheduleDto[]>;
  findById(id: string): Promise<FilmDto | null>;
  updateTakenSeats(
    filmId: string,
    sessionId: string,
    takenSeat: string,
  ): Promise<any>;
}

@Injectable()
export class FilmsTypeOrmRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepo: Repository<FilmEntity>,

    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepo: Repository<ScheduleEntity>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    try {
      const films = await this.filmRepo.find({
        relations: ['schedules'],
      });

      if (!films) {
        console.error(' films is undefined!');
        return [];
      }

      return films.map((film) => this.toFilmDto(film));
    } catch (error) {
      console.error(' Error in findAll:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<FilmDto | null> {
    const film = await this.filmRepo.findOne({
      where: { id },
      relations: ['schedules'],
    });
    return film ? this.toFilmDto(film) : null;
  }

  async findScheduleById(filmId: string): Promise<ScheduleDto[]> {
    const film = await this.filmRepo.findOne({
      where: { id: filmId },
      relations: ['schedules'],
    });
    return film?.schedules.map((item) => this.toScheduleDto(item)) ?? [];
  }

  async updateTakenSeats(
    filmId: string,
    sessionId: string,
    takenSeat: string,
  ): Promise<void> {
    const session = await this.scheduleRepo.findOne({
      where: {
        id: sessionId,
        film: { id: filmId },
      },
    });
    if (!session) return;

    const takenSeatsArray = session.taken ? session.taken.split(',') : [];
    if (!takenSeatsArray.includes(takenSeat)) {
      takenSeatsArray.push(takenSeat);
      session.taken = takenSeatsArray.join(',');
      await this.scheduleRepo.save(session);
    }
  }

  private toFilmDto(film: FilmEntity): FilmDto {
    const tags =
    typeof film.tags === 'string'
      ? film.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
      
      return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
      schedule: film.schedules.map(this.toScheduleDto),
    };
  }

  private toScheduleDto(s: ScheduleEntity): ScheduleDto {
    const taken =
    typeof s.taken === 'string'
      ? s.taken
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean)
      : [];
      
    return {
      id: s.id,
      daytime: s.daytime,
      hall: s.hall,
      rows: s.rows,
      seats: s.seats,
      price: s.price,
      taken
    };
  }
}
