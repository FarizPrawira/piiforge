import { describe, it, expect } from 'vitest';
import { array } from '../src/schema/array.js';
import { redact } from '../src/maskers/redact.js';
import { passthrough } from '../src/maskers/passthrough.js';

describe('array', () => {
  it('applies item masker to each element', () => {
    expect(array(redact()).apply(['a', 'b', 'c'])).toEqual(['[REDACTED]', '[REDACTED]', '[REDACTED]']);
  });

  it('passes through empty array as new array', () => {
    const out = array(redact()).apply([]) as unknown[];
    expect(out).toEqual([]);
  });

  it('passes through null and undefined', () => {
    expect(array(redact()).apply(null)).toBe(null);
    expect(array(redact()).apply(undefined)).toBe(undefined);
  });

  it('redacts on type mismatch', () => {
    expect(array(redact()).apply('not array')).toBe('[REDACTED]');
  });

  it('does not mutate input', () => {
    const input = ['a', 'b'];
    const output = array(passthrough()).apply(input);
    expect(output).not.toBe(input);
    expect(output).toEqual(['a', 'b']);
  });

  it('masks nested arrays', () => {
    const m = array(array(redact()));
    expect(m.apply([['a', 'b'], ['c']])).toEqual([
      ['[REDACTED]', '[REDACTED]'],
      ['[REDACTED]'],
    ]);
  });

  it('preserves mixed primitive types via passthrough', () => {
    const m = array(passthrough());
    expect(m.apply([1, 'a', null, true, { x: 1 }])).toEqual([1, 'a', null, true, { x: 1 }]);
  });
});
