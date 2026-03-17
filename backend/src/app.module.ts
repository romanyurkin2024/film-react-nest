import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { join } from 'path';
import { TypeOrmRepositoryModule } from './films/repository/typeorm.repository.module';
import { FilmsModule } from './films/films.module';
import { LoggerModule } from './logger/logger.module';

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
    TypeOrmRepositoryModule,
    FilmsModule,
    LoggerModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class AppModule {}
