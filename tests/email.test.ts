import { describe, it, expect } from 'vitest';
import { email } from '../src/maskers/email.js';

describe('email', () => {
  it('masks local part keeping first and last char by default', () => {
    expect(email().apply('johndoe@mail.com')).toBe('j*****e@mail.com');
    expect(email().apply('abcdef@x.com')).toBe('a****f@x.com');
  });

  it('returns value unchanged when start + end >= local length', () => {
    expect(email().apply('j@mail.com')).toBe('j@mail.com');
    expect(email().apply('jd@mail.com')).toBe('jd@mail.com');
  });

  it('supports custom start and end', () => {
    expect(email({ start: 2, end: 1 }).apply('johndoe@mail.com')).toBe('jo****e@mail.com');
    expect(email({ start: 0, end: 0 }).apply('johndoe@mail.com')).toBe('*******@mail.com');
    expect(email({ start: 1, end: 0 }).apply('jd@mail.com')).toBe('j*@mail.com');
  });

  it('supports fixed maskLength regardless of original length', () => {
    expect(email({ start: 1, end: 1, maskLength: 3 }).apply('johnnnnnnnoe@mail.com')).toBe('j***e@mail.com');
    expect(email({ start: 1, end: 1, maskLength: 3 }).apply('johndoe@mail.com')).toBe('j***e@mail.com');
    expect(email({ start: 0, end: 0, maskLength: 4 }).apply('johndoe@mail.com')).toBe('****@mail.com');
  });

  it('falls back to redact for invalid emails (no @)', () => {
    expect(email().apply('not-an-email')).toBe('[REDACTED]');
  });

  it('returns value unchanged when local part is empty (@ at index 0)', () => {
    expect(email().apply('@x.com')).toBe('@x.com');
  });

  it('splits on the last @ when multiple are present', () => {
    expect(email().apply('a@b@x.com')).toBe('a*b@x.com');
  });

  it('supports custom mask char', () => {
    expect(email({}, { char: '·' }).apply('johndoe@mail.com')).toBe('j·····e@mail.com');
  });

  it('passes through null and undefined at runtime', () => {
    // @ts-expect-error — runtime safety only; types forbid non-string input
    expect(email().apply(null)).toBe(null);
    // @ts-expect-error — runtime safety only; types forbid non-string input
    expect(email().apply(undefined)).toBe(undefined);
  });

  it('redacts on type mismatch at runtime', () => {
    // @ts-expect-error — runtime safety only; types forbid non-string input
    expect(email().apply(123)).toBe('[REDACTED]');
  });
});
