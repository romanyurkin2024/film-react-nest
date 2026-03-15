import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {

   private escape(val: any): string {
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    return str
      .replace(/\\/g, '\\\\')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/=/g, '\\=');
  }

  private format(level: string, message: any, optionalParams: any[]) {
    const parts = [
      'tskv',
      `timestamp=${new Date().toISOString()}`,
      `level=${level}`,
      `message=${this.escape(message)}`
    ];

    optionalParams.forEach((param, idx) => {
      if (param && typeof param === 'object' && !Array.isArray(param)) {
        Object.entries(param).forEach(([key, value]) => {
          parts.push(`${this.escape(key)}=${this.escape(value)}`);
        });
      } else {
        parts.push(`param${idx}=${this.escape(param)}`);
      }
    });

    return parts.join('\t');
  }

  log(message: any, ...optional: any[]) {
    process.stdout.write(this.format('log', message, optional) + '\n');
  }

  error(message: any, ...optional: any[]) {
    process.stderr.write(this.format('error', message, optional) + '\n');
  }

  warn(message: any, ...optional: any[]) {
    process.stderr.write(this.format('warn', message, optional) + '\n');
  }

  debug(message: any, ...optional: any[]) {
    process.stderr.write(this.format('debug', message, optional) + '\n');
  }

  verbose(message: any, ...optional: any[]) {
    process.stderr.write(this.format('verbose', message, optional) + '\n');
  }
}