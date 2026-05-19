import type { Masker, MaskCharOptions } from '../types.js';
import { DEFAULT_MASK_CHAR, maskMiddle } from '../utils/mask-char.js';
import { redactValue } from './redact.js';

export interface EmailOptions {
  start?: number;
  end?: number;
  maskLength?: number;
}

export function emailValue(
  value: string,
  options: EmailOptions = {},
  charOptions: MaskCharOptions = {},
): string {
  const { start = 1, end = 1, maskLength } = options;
  const { char = DEFAULT_MASK_CHAR } = charOptions;

  const at = value.lastIndexOf('@');
  if (at === -1) return redactValue(value) as string;

  const local = value.slice(0, at);
  const domain = value.slice(at);

  if (local.length === 0 || start + end >= local.length) return value;

  const maskLen = maskLength ?? local.length - start - end;
  return maskMiddle(local, start, end, maskLen, char) + domain;
}

export function email(
  options: EmailOptions = {},
  charOptions: MaskCharOptions = {},
): Masker<string, string> {
  return {
    _type: 'email',
    apply(value: string): string {
      if (value === null || value === undefined) return value;
      if (typeof value !== 'string') return redactValue(value) as string;
      return emailValue(value, options, charOptions);
    },
  };
}
