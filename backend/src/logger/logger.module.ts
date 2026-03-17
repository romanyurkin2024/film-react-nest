import { Module, Global } from '@nestjs/common';
import { TskvLogger } from './TSKVLogger';
import { JsonLogger } from './JsonLogger'

@Global()
@Module({
  providers: [
    {
      provide: 'APP_LOGGER',
      useFactory: () => {
        const type = process.env.LOGGER_TYPE || 'json';
        return type === 'tskv' ? new TskvLogger() : new JsonLogger();
      },
    },
  ],
  exports: ['APP_LOGGER'],
})
export class LoggerModule {}
