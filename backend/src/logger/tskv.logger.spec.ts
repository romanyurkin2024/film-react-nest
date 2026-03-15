import { describe, beforeEach, expect, jest, afterEach, it } from '@jest/globals';
import { TskvLogger } from './TSKVLogger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let stdoutSpy: ReturnType<typeof jest.spyOn>;;
  let stderrSpy: ReturnType<typeof jest.spyOn>;;

  beforeEach(() => {
    logger = new TskvLogger();
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    
    jest.useFakeTimers(); // Замокали дату sysdate
    jest.setSystemTime(new Date('2026-03-15T20:41:00.000Z'));
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
    jest.useRealTimers();
  });

  describe('Функция format', () => {
    it('Должна отформатировать базовое сообщение лога:', () => {
      logger.log('Test message');

      expect(stdoutSpy).toHaveBeenCalledWith(
        'tskv\ttimestamp=2026-03-15T20:41:00.000Z\tlevel=log\tmessage=Test message\n'
      );
    });

    it('Должна форматировать сообщение об ошибке:', () => {
      logger.error('Error occurred');

      expect(stderrSpy).toHaveBeenCalledWith(
        'tskv\ttimestamp=2026-03-15T20:41:00.000Z\tlevel=error\tmessage=Error occurred\n'
      );
    });

    it('Должна форматировать warn в stderr:', () => {
      logger.warn('Warning message');

      expect(stderrSpy).toHaveBeenCalledWith(
        expect.stringContaining('level=warn\tmessage=Warning message')
      );
    });

    it('Должна форматировать debug в stderr:', () => {
      logger.debug('Debug info');

      expect(stderrSpy).toHaveBeenCalledWith(
        expect.stringContaining('level=debug\tmessage=Debug info')
      );
    });

    it('Должна форматировать verbose в stderr:', () => {
      logger.verbose('Verbose details');

      expect(stderrSpy).toHaveBeenCalledWith(
        expect.stringContaining('level=verbose\tmessage=Verbose details')
      );
    });
  });

  describe('Escape function', () => {
    it('Должна экранировать символы для вывода:', () => {
      logger.log('Message\twith\ttabs');

      expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining('message=Message\\twith\\ttabs')
      );
    });

    it('Должна экранировать символ новой строки в сообщении:', () => {
      logger.log('Line\nbreak');

      expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining('message=Line\\nbreak')
      );
    });

    it('Должна экранировать знак равенства:', () => {
      logger.log('key=value');

      expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining('message=key\\=value')
      );
    });

    it('Должна экранировать обратный слэш:', () => {
      logger.log('path\\to\\file');

      expect(stdoutSpy).toHaveBeenCalledWith(
        expect.stringContaining('message=path\\\\to\\\\file')
      );
    });
  });

  describe('Тест опциональных параметров', () => {
    it('Должен добавлять примитивные параметры с индексом:', () => {
      logger.log('Message', 'param1', 123, true);

      const output = stdoutSpy.mock.calls[0][0];
      expect(output).toContain('param0=param1');
      expect(output).toContain('param1=123');
      expect(output).toContain('param2=true');
    });

    it('Должен раскрывать объектные параметры как пары ключ-значение:', () => {
      logger.log('User action', { userId: '123', action: 'login' });

      const output = stdoutSpy.mock.calls[0][0];
      expect(output).toContain('userId=123');
      expect(output).toContain('action=login');
      expect(output).not.toContain('param0');
    });

    it('Должен обрабатывать смешанные параметры (объект + примитивы):', () => {
      logger.log('Mixed', { id: 1 }, 'extra', 42);

      const output = stdoutSpy.mock.calls[0][0];
      expect(output).toContain('id=1');
      expect(output).toContain('param1=extra');
      expect(output).toContain('param2=42');
    });

    it('Должен экранировать ключи и значения в объектных параметрах:', () => {
      logger.log('Test', { 'key=with=equals': 'value\nwith\nnewlines' });

      const output = stdoutSpy.mock.calls[0][0];
      expect(output).toContain('key\\=with\\=equals=value\\nwith\\nnewlines');
    });

    it('Должен обрабатывать вложенные объекты как JSON строку:', () => {
      const nested = { user: { id: 1, name: 'John' } };
      logger.log('Nested', nested);

      const output = stdoutSpy.mock.calls[0][0];
      expect(output).toContain('user={"id":1,"name":"John"}');
    });

    it('Должен обрабатывать массивы как JSON строку: ', () => {
      logger.log('Array test', [1, 2, 3]);

      const output = stdoutSpy.mock.calls[0][0];
      expect(output).toContain('param0=[1,2,3]');
    });

    it('Должен обрабатывать null и undefined', () => {
      logger.log('Null test', null, undefined);

      const output = stdoutSpy.mock.calls[0][0];
      expect(output).toContain('param0=null');
      expect(output).toContain('param1=undefined');
    });
  });

  describe('Потоки вывода', () => {
    it('Должен использовать stdout для уровня log', () => {
      logger.log('Test');
      expect(stdoutSpy).toHaveBeenCalled();
      expect(stderrSpy).not.toHaveBeenCalled();
    });

    it('Должен использовать stderr для уровней error, warn, debug, verbose', () => {
      logger.error('Error');
      logger.warn('Warn');
      logger.debug('Debug');
      logger.verbose('Verbose');

      expect(stdoutSpy).not.toHaveBeenCalled();
      expect(stderrSpy).toHaveBeenCalledTimes(4);
    });
  });
});