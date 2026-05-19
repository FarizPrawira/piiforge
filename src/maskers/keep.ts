import type { Masker, MaskCharOptions } from '../types.js';
import { DEFAULT_MASK_CHAR, maskMiddle } from '../utils/mask-char.js';
import { redactValue } from './redact.js';

export interface KeepOptions {
  start?: number;
  end?: number;
  maskLength?: number;
}

export function keepValue(
  value: string,
  options: KeepOptions = {},
  charOptions: MaskCharOptions = {},
): string {
  const { start = 0, end = 0, maskLength } = options;
  const { char = DEFAULT_MASK_CHAR } = charOptions;

  if (value === '') return value;
  if (start + end >= value.length) return value;

  const maskLen = maskLength ?? value.length - start - end;
  return maskMiddle(value, start, end, maskLen, char);
}

export function keep(
  options: KeepOptions = {},
  charOptions: MaskCharOptions = {},
): Masker<string, string> {
  return {
    _type: 'keep',
    apply(value: string): string {
      if (value === null || value === undefined) return value;
      if (typeof value !== 'string') return redactValue(value) as string;
      return keepValue(value, options, charOptions);
    },
  };
}
