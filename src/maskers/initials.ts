import type { Masker } from '../types.js';
import { redactValue } from './redact.js';

export interface InitialsOptions {
  separator?: string;
  trailing?: boolean;
  uppercase?: boolean;
}

export function initialsValue(value: string, options: InitialsOptions = {}): string {
  const { separator = '.', trailing = true, uppercase = true } = options;

  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return value;

  const initials = parts
    .map((part) => {
      const first = part[0] ?? '';
      return uppercase ? first.toUpperCase() : first;
    })
    .join(separator);

  return trailing ? initials + separator : initials;
}

export function initials(options: InitialsOptions = {}): Masker<string, string> {
  return {
    _type: 'initials',
    apply(value: string): string {
      if (value === null || value === undefined) return value;
      if (typeof value !== 'string') return redactValue(value) as string;
      return initialsValue(value, options);
    },
  };
}
