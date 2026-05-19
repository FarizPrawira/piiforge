import type { Masker } from '../types.js';

export function fn<T>(transform: (value: T) => T): Masker<T, T> {
  return {
    _type: 'fn',
    apply(value: T): T {
      if (value === null || value === undefined) return value;
      return transform(value);
    },
  };
}
