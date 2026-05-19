import { describe, it, expect } from 'vitest';
import { fn } from '../src/maskers/fn.js';

describe('fn', () => {
  it('runs custom transform', () => {
    expect(fn<number>((v) => Math.floor(v / 10) * 10).apply(1987)).toBe(1980);
    expect(fn<string>((v) => v.toUpperCase()).apply('abc')).toBe('ABC');
  });

  it('passes through null and undefined without invoking transform', () => {
    let called = false;
    const m = fn<string>((v) => {
      called = true;
      return v;
    });
    expect(m.apply(null as unknown as string)).toBe(null);
    expect(m.apply(undefined as unknown as string)).toBe(undefined);
    expect(called).toBe(false);
  });
});
