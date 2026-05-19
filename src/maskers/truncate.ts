import type { Masker } from '../types.js';
import { redactValue } from './redact.js';

export const DEFAULT_TRUNCATE_SUFFIX = '…';

export function truncateValue(
  value: string,
  maxLen: number,
  suffix: string = DEFAULT_TRUNCATE_SUFFIX,
): string {
  if (value.length <= maxLen) return value;
  return value.slice(0, maxLen) + suffix;
}

export function truncate(
  maxLen: number,
  suffix: string = DEFAULT_TRUNCATE_SUFFIX,
): Masker<string, string> {
  return {
    _type: 'truncate',
    apply(value: string): string {
      if (value === null || value === undefined) return value;
      if (typeof value !== 'string') return redactValue(value) as string;
      return truncateValue(value, maxLen, suffix);
    },
  };
}
