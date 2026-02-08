import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';

import { configProvider } from './app.config.provider';
import { OrderController } from './order/order.controller';
import { OrderService } from './order/order.service';
import { join } from 'path';
import { TypeOrmRepositoryModule } from './films/repository/typeorm.repository.module';
import { FilmsModule } from './films/films.module';

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
  ],
  controllers: [OrderController],
  providers: [configProvider, OrderService],
})
export class AppModule {}
