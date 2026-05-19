import { describe, it, expect } from 'vitest';
import { creditCard } from '../src/maskers/creditCard.js';

describe('creditCard', () => {
  it('keeps the last 4 digits by default, masking the rest and preserving dashes', () => {
    expect(creditCard().apply('4111-2222-3333-4444')).toBe('****-****-****-4444');
  });

  it('preserves spaces as separators', () => {
    expect(creditCard().apply('4111 2222 3333 4444')).toBe('**** **** **** 4444');
  });

  it('handles unseparated digits', () => {
    expect(creditCard().apply('4111222233334444')).toBe('************4444');
  });

  it('supports a custom keepLast', () => {
    expect(creditCard({ keepLast: 6 }).apply('4111-2222-3333-4444')).toBe('****-****-**33-4444');
  });

  it('supports a custom mask char', () => {
    expect(creditCard({}, { char: '•' }).apply('4111-2222-3333-4444')).toBe('••••-••••-••••-4444');
  });

  it('returns value unchanged when there are not enough digits to mask', () => {
    expect(creditCard().apply('123')).toBe('123');
    expect(creditCard().apply('1234')).toBe('1234');
    expect(creditCard().apply('no-digits-here')).toBe('no-digits-here');
  });

  it('passes through null and undefined at runtime', () => {
    // @ts-expect-error — runtime safety only; types forbid non-string input
    expect(creditCard().apply(null)).toBe(null);
    // @ts-expect-error — runtime safety only; types forbid non-string input
    expect(creditCard().apply(undefined)).toBe(undefined);
  });

  it('redacts on type mismatch at runtime', () => {
    // @ts-expect-error — runtime safety only; types forbid non-string input
    expect(creditCard().apply(4111222233334444)).toBe('[REDACTED]');
  });
});
