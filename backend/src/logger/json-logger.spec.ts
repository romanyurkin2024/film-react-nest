import { describe, beforeEach, expect, jest, it } from '@jest/globals';
import { JsonLogger } from './JsonLogger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
    jest.restoreAllMocks();
  });

  it('Должен вызывать console.log при функции log()', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger.log('test message', { extra: 123 });
    expect(spy).toHaveBeenCalled();
    const calledArg = spy.mock.calls[0][0];
    const parsed = JSON.parse(calledArg);
    expect(parsed.level).toBe('log');
    expect(parsed.message).toBe('test message');
    expect(parsed.optional[0]).toEqual({ extra: 123 });
  });

  it('Должен вызывать console.error при функции error()', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const err = new Error('oops');
    logger.error('error occurred', err);
    const parsed = JSON.parse(spy.mock.calls[0][0]);
    expect(parsed.level).toBe('error');
    expect(parsed.optional[0].name).toBe('Error');
    expect(parsed.optional[0].message).toBe('oops');
    expect(parsed.optional[0].stack).toContain('Error: oops');
  });

  it('Должен вызывать console.warn при функции warn()', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    logger.warn('warning');
    const parsed = JSON.parse(spy.mock.calls[0][0]);
    expect(parsed.level).toBe('warn');
    expect(parsed.message).toBe('warning');
  });

  it('Должен вызывать console.debug при функции debug()', () => {
    const spy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    logger.debug('debugging');
    const parsed = JSON.parse(spy.mock.calls[0][0]);
    expect(parsed.level).toBe('debug');
    expect(parsed.message).toBe('debugging');
  });

  it('Должен вызывать console.info при функции verbose()', () => {
    const spy = jest.spyOn(console, 'info').mockImplementation(() => {});
    logger.verbose('verbose message');
    const parsed = JSON.parse(spy.mock.calls[0][0]);
    expect(parsed.level).toBe('verbose');
    expect(parsed.message).toBe('verbose message');
  });
});
