import { describe, it, expect } from 'vitest';
import { initials } from '../src/maskers/initials.js';

describe('initials', () => {
  it('reduces a multi-word name to uppercase initials with trailing separator', () => {
    expect(initials().apply('John Doe')).toBe('J.D.');
    expect(initials().apply('jane mary smith')).toBe('J.M.S.');
  });

  it('handles a single word', () => {
    expect(initials().apply('JohnDoe')).toBe('J.');
  });

  it('collapses extra whitespace', () => {
    expect(initials().apply('   John   Doe  ')).toBe('J.D.');
  });

  it('returns value unchanged for an empty or whitespace-only string', () => {
    expect(initials().apply('')).toBe('');
    expect(initials().apply('   ')).toBe('   ');
  });

  it('supports custom separator and disabling trailing/uppercase', () => {
    expect(initials({ separator: ' ' }).apply('John Doe')).toBe('J D ');
    expect(initials({ trailing: false }).apply('John Doe')).toBe('J.D');
    expect(initials({ uppercase: false }).apply('john doe')).toBe('j.d.');
  });

  it('passes through null and undefined at runtime', () => {
    // @ts-expect-error — runtime safety only; types forbid non-string input
    expect(initials().apply(null)).toBe(null);
    // @ts-expect-error — runtime safety only; types forbid non-string input
    expect(initials().apply(undefined)).toBe(undefined);
  });
});
