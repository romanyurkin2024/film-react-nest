import { Inject, Injectable } from '@nestjs/common';
import { IFilmsRepository } from './repository/films.typeorm.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('FILMS_REPOSITORY')
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  async findAll() {
    const films = await this.filmsRepository.findAll();
    return {
      total: films.length,
      items: films,
    };
  }

  async findScheduleById(id: string) {
    const films = await this.filmsRepository.findScheduleById(id);
    return {
      total: films.length,
      items: films,
    };
  }
}
