import { describe, it, expect } from 'vitest';
import { passthrough } from '../src/maskers/passthrough.js';

describe('passthrough', () => {
  it('returns the value unchanged', () => {
    expect(passthrough().apply('abc')).toBe('abc');
    expect(passthrough().apply(42)).toBe(42);
    expect(passthrough().apply(null)).toBe(null);
    expect(passthrough().apply(undefined)).toBe(undefined);
  });

  it('does not clone object references', () => {
    const obj = { a: 1 };
    expect(passthrough().apply(obj)).toBe(obj);
  });
});
