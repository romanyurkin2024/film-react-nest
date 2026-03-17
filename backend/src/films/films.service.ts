import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { IFilmsRepository } from './repository/films.typeorm.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('FILMS_REPOSITORY')
    private readonly filmsRepository: IFilmsRepository,

    @Inject('APP_LOGGER') 
    private readonly logger: LoggerService
  ) {}

  async findAll() {
    this.logger.log('GET /films - запрос списка всех фильмов');
    const films = await this.filmsRepository.findAll();
    return {
      total: films.length,
      items: films,
    };
  }

  async findScheduleById(id: string) {
    this.logger.log(`GET /films/${id}/schedule - запрос расписания`);
    const films = await this.filmsRepository.findScheduleById(id);
    return {
      total: films.length,
      items: films,
    };
  }
}
