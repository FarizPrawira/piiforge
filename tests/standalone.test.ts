import { describe, it, expect } from 'vitest';
import { mask } from '../src/standalone.js';

describe('standalone mask', () => {
  it('mask.email default', () => {
    expect(mask.email('johndoe@mail.com')).toBe('j*****e@mail.com');
  });

  it('mask.email with start/end and fixed maskLength', () => {
    expect(mask.email('johndoe@mail.com', { start: 2, end: 1 })).toBe('jo****e@mail.com');
    expect(mask.email('johnnnnnnnoe@mail.com', { start: 1, end: 1, maskLength: 3 })).toBe('j***e@mail.com');
  });

  it('mask.keep with end option', () => {
    expect(mask.keep('081234567890', { end: 4 })).toBe('********7890');
  });

  it('mask.keep with start and end', () => {
    expect(mask.keep('081234567890', { start: 2, end: 2 })).toBe('08********90');
  });

  it('mask.redact default and custom', () => {
    expect(mask.redact('anything')).toBe('[REDACTED]');
    expect(mask.redact('anything', '****')).toBe('****');
  });

  it('mask.truncate', () => {
    expect(mask.truncate('long text here...', 8)).toBe('long tex…');
  });

  it('mask.creditCard', () => {
    expect(mask.creditCard('4111-2222-3333-4444')).toBe('****-****-****-4444');
    expect(mask.creditCard('4111-2222-3333-4444', { keepLast: 6 })).toBe('****-****-**33-4444');
  });

  it('mask.initials', () => {
    expect(mask.initials('John Doe')).toBe('J.D.');
    expect(mask.initials('john doe', { uppercase: false, trailing: false })).toBe('j.d');
  });
});

describe('standalone ↔ schema parity', () => {
  it('mask.email matches x.email().apply', async () => {
    const { x } = await import('../src/index.js');
    const value = 'johndoe@mail.com';
    expect(mask.email(value)).toBe(x.email().apply(value));
    expect(mask.email(value, { start: 2, end: 1 })).toBe(
      x.email({ start: 2, end: 1 }).apply(value),
    );
  });

  it('mask.keep matches x.keep().apply', async () => {
    const { x } = await import('../src/index.js');
    const value = '081234567890';
    expect(mask.keep(value, { end: 4 })).toBe(x.keep({ end: 4 }).apply(value));
    expect(mask.keep(value, { start: 2, end: 2, maskLength: 3 })).toBe(
      x.keep({ start: 2, end: 2, maskLength: 3 }).apply(value),
    );
  });

  it('mask.truncate matches x.truncate().apply', async () => {
    const { x } = await import('../src/index.js');
    const value = 'long text here...';
    expect(mask.truncate(value, 8)).toBe(x.truncate(8).apply(value));
  });
});
