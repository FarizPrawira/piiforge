import { describe, it, expect } from 'vitest';
import { redact } from '../src/maskers/redact.js';

describe('redact', () => {
  it('replaces value with default placeholder', () => {
    expect(redact().apply('secret')).toBe('[REDACTED]');
    expect(redact().apply(12345)).toBe('[REDACTED]');
  });

  it('uses custom replacement', () => {
    expect(redact('****').apply('secret')).toBe('****');
  });

  it('passes through null and undefined', () => {
    expect(redact().apply(null)).toBe(null);
    expect(redact().apply(undefined)).toBe(undefined);
  });
});
