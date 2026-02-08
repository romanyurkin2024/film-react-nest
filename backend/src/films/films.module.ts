import { Module } from '@nestjs/common';
import { FilmEntity } from './schemas/film.entity';
import { ScheduleEntity } from './schemas/Schedule.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsTypeOrmRepository } from '../films/repository/films.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FilmEntity, ScheduleEntity])],
  controllers: [FilmsController],
  providers: [
    FilmsService,
    FilmsTypeOrmRepository,
    {
      provide: 'FILMS_REPOSITORY',
      useClass: FilmsTypeOrmRepository,
    },
  ],
  exports: [FilmsService, 'FILMS_REPOSITORY'],
})
export class FilmsModule {}
