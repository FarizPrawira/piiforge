import type { ArrayMasker, Masker } from '../types.js';
import { redactValue } from '../maskers/redact.js';

export function array<Item extends Masker<any, any>>(item: Item): ArrayMasker<Item> {
  return {
    _type: 'array',
    item,
    apply(value: unknown): unknown {
      if (value === null || value === undefined) return value;
      if (!Array.isArray(value)) return redactValue(value);

      return value.map((el) => item.apply(el));
    },
  };
}
