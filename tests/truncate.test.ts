import { describe, it, expect } from 'vitest';
import { truncate } from '../src/maskers/truncate.js';

describe('truncate', () => {
  it('truncates and appends default suffix', () => {
    expect(truncate(8).apply('long text here...')).toBe('long tex…');
  });

  it('does not truncate when value is shorter than max', () => {
    expect(truncate(20).apply('short')).toBe('short');
  });

  it('uses custom suffix', () => {
    expect(truncate(5, '...').apply('long text')).toBe('long ...');
  });

  it('does not truncate when value length equals maxLen (boundary)', () => {
    expect(truncate(3).apply('abc')).toBe('abc');
  });

  it('truncates to just the suffix when maxLen is 0', () => {
    expect(truncate(0).apply('abc')).toBe('…');
  });

  it('emits a suffix longer than maxLen (output exceeds maxLen)', () => {
    expect(truncate(2, '---').apply('hello')).toBe('he---');
  });

  it('passes through null and undefined at runtime', () => {
    // @ts-expect-error — runtime safety only; types forbid non-string input
    expect(truncate(5).apply(null)).toBe(null);
    // @ts-expect-error — runtime safety only; types forbid non-string input
    expect(truncate(5).apply(undefined)).toBe(undefined);
  });
});
