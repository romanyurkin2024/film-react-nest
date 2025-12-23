import { Injectable } from '@nestjs/common';
import { FilmsRepository } from 'src/repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

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
