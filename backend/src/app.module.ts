import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { FilmsService } from './films/films.service';
import { FilmsRepository } from './repository/films.repository';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from './films/schemas/film.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/content/afisha',
      rootPath: join(__dirname, '..', 'public', 'content', 'afisha'),
    }),
    MongooseModule.forRoot(
      process.env.DATABASE_URL || 'mongodb://localhost:27017/films',
    ),
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController, OrderController],
  providers: [configProvider, FilmsService, FilmsRepository, OrderService],
})
export class AppModule {}
