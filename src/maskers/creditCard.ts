import type { Masker, MaskCharOptions } from '../types.js';
import { DEFAULT_MASK_CHAR } from '../utils/mask-char.js';
import { redactValue } from './redact.js';

export interface CreditCardOptions {
  keepLast?: number;
}

export function creditCardValue(
  value: string,
  options: CreditCardOptions = {},
  charOptions: MaskCharOptions = {},
): string {
  const { keepLast = 4 } = options;
  const { char = DEFAULT_MASK_CHAR } = charOptions;

  const digitCount = (value.match(/\d/g) ?? []).length;
  if (digitCount <= keepLast) return value;

  const digitsToMask = digitCount - keepLast;

  let masked = 0;
  let result = '';
  for (const ch of value) {
    if (/\d/.test(ch) && masked < digitsToMask) {
      result += char;
      masked++;
    } else {
      result += ch;
    }
  }
  return result;
}

export function creditCard(
  options: CreditCardOptions = {},
  charOptions: MaskCharOptions = {},
): Masker<string, string> {
  return {
    _type: 'creditCard',
    apply(value: string): string {
      if (value === null || value === undefined) return value;
      if (typeof value !== 'string') return redactValue(value) as string;
      return creditCardValue(value, options, charOptions);
    },
  };
}
