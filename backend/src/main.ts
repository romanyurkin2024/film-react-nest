import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { TskvLogger } from './logger/TSKVLogger';
import { JsonLogger } from './logger/JsonLogger';
import { DevLogger } from './logger/DevLogger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const loggerType = process.env.LOGGER_TYPE || 'dev';
  switch(loggerType){
    case 'json':  
      app.useLogger(new JsonLogger());
      break;
    case 'tskv':  
      app.useLogger(new TskvLogger());
      break;
    default:  
      app.useLogger(new DevLogger());
  }

  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
