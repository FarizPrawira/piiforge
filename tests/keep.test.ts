import { describe, it, expect } from 'vitest';
import { keep } from '../src/maskers/keep.js';

describe('keep', () => {
  it('keeps the last N characters', () => {
    expect(keep({ end: 4 }).apply('081234567890')).toBe('********7890');
  });

  it('keeps the first N characters', () => {
    expect(keep({ start: 3 }).apply('1234567890')).toBe('123*******');
  });

  it('keeps both ends', () => {
    expect(keep({ start: 2, end: 2 }).apply('081234567890')).toBe('08********90');
  });

  it('returns the value unchanged if start + end >= length', () => {
    expect(keep({ start: 5, end: 5 }).apply('abc')).toBe('abc');
    expect(keep({ start: 2, end: 1 }).apply('abc')).toBe('abc');
  });

  it('supports custom mask character', () => {
    expect(keep({ end: 4 }, { char: '•' }).apply('081234567890')).toBe('••••••••7890');
  });

  it('supports fixed maskLength', () => {
    expect(keep({ end: 4, maskLength: 4 }).apply('081234567890')).toBe('****7890');
    expect(keep({ start: 2, end: 2, maskLength: 3 }).apply('081234567890')).toBe('08***90');
    expect(keep({ maskLength: 5 }).apply('081234567890')).toBe('*****');
  });

  it('collapses to head + tail when maskLength is 0', () => {
    expect(keep({ start: 1, end: 1, maskLength: 0 }).apply('hello')).toBe('ho');
    expect(keep({ end: 2, maskLength: 0 }).apply('hello')).toBe('lo');
  });

  it('returns value unchanged when start or end exceeds length', () => {
    expect(keep({ start: 100 }).apply('abc')).toBe('abc');
    expect(keep({ end: 100 }).apply('abc')).toBe('abc');
  });

  it('passes through null and undefined at runtime', () => {
    // @ts-expect-error — runtime safety only; types forbid non-string input
    expect(keep({ end: 4 }).apply(null)).toBe(null);
    // @ts-expect-error — runtime safety only; types forbid non-string input
    expect(keep({ end: 4 }).apply(undefined)).toBe(undefined);
  });

  it('redacts on type mismatch at runtime', () => {
    // @ts-expect-error — runtime safety only; types forbid non-string input
    expect(keep({ end: 4 }).apply(12345)).toBe('[REDACTED]');
  });

  it('returns empty string unchanged', () => {
    expect(keep({ end: 4 }).apply('')).toBe('');
  });
});
