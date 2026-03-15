import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  private format(level: string, message: any, ...optional: any[]) {
    const processedOptional = optional.map((arg) => {
      if (arg instanceof Error) {
        return {
          name: arg.name,
          message: arg.message,
          stack: arg.stack?.split('\n').slice(0, 10).join('\n'),
        };
      }
      return arg;
    });

    const logObject: any = {
      level,
      message,
      timestamp: new Date().toISOString(),
    };

    if (processedOptional.length > 0) {
      logObject.optional = processedOptional;
    }

    return JSON.stringify(logObject);
  }

  log(message: any, ...optional: any[]) {
    console.log(this.format('log', message, ...optional));
  }

  error(message: any, ...optional: any[]) {
    console.error(this.format('error', message, ...optional));
  }

  warn(message: any, ...optional: any[]) {
    console.warn(this.format('warn', message, ...optional));
  }

  debug(message: any, ...optional: any[]) {
    console.debug(this.format('debug', message, ...optional));
  }

  verbose(message: any, ...optional: any[]) {
    console.info(this.format('verbose', message, ...optional));
  }
}
