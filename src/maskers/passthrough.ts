import type { Masker } from '../types.js';

export function passthrough<T = unknown>(): Masker<T, T> {
  return {
    _type: 'passthrough',
    apply(value: T): T {
      return value;
    },
  };
}
