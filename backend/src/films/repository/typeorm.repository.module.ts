import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmEntity } from '../schemas/Film.entity';
import { ScheduleEntity } from '../schemas/Schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<'postgres'>('DATABASE_DRIVER'),
        host: 'localhost',
        port: 5432,
        database: 'prac',
        username: config.get('DATABASE_USERNAME'),
        password: config.get('DATABASE_PASSWORD'),
        entities: [FilmEntity, ScheduleEntity],
      }),
    }),
    TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
  ],
})
export class TypeOrmRepositoryModule {}
