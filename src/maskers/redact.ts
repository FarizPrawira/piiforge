import type { Masker } from '../types.js';

export const DEFAULT_REDACT = '[REDACTED]';

export function redactValue<T>(value: T, replacement: string = DEFAULT_REDACT): T | string {
  if (value === null || value === undefined) return value;
  return replacement;
}

export function redact(replacement: string = DEFAULT_REDACT): Masker<unknown, string> {
  return {
    _type: 'redact',
    apply(value: unknown): string {
      return redactValue(value, replacement) as string;
    },
  };
}
