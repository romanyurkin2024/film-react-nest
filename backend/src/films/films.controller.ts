// movies.controller.ts
import { Controller, Get, Inject, LoggerService, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService, 
    @Inject('APP_LOGGER') private readonly logger: LoggerService
  ) {}

  @Get()
  findAll() {
    this.logger.log('GET /films - запрос списка всех фильмов');
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  findSchedule(@Param('id') id: string) {
    this.logger.log(`GET /films/${id}/schedule - запрос расписания`, { filmId: id });
    return this.filmsService.findScheduleById(id);;
  }
}
