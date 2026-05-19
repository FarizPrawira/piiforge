import { keepValue, type KeepOptions } from './maskers/keep.js';
import { emailValue, type EmailOptions } from './maskers/email.js';
import { truncateValue, DEFAULT_TRUNCATE_SUFFIX } from './maskers/truncate.js';
import { creditCardValue, type CreditCardOptions } from './maskers/creditCard.js';
import { initialsValue, type InitialsOptions } from './maskers/initials.js';
import { DEFAULT_REDACT } from './maskers/redact.js';
import type { MaskCharOptions } from './types.js';

export const mask = {
  email(value: string, options: EmailOptions = {}, charOptions?: MaskCharOptions): string {
    return emailValue(value, options, charOptions);
  },
  keep(value: string, options: KeepOptions = {}, charOptions?: MaskCharOptions): string {
    return keepValue(value, options, charOptions);
  },
  redact(_value: unknown, replacement: string = DEFAULT_REDACT): string {
    return replacement;
  },
  truncate(value: string, maxLen: number, suffix: string = DEFAULT_TRUNCATE_SUFFIX): string {
    return truncateValue(value, maxLen, suffix);
  },
  creditCard(value: string, options: CreditCardOptions = {}, charOptions?: MaskCharOptions): string {
    return creditCardValue(value, options, charOptions);
  },
  initials(value: string, options: InitialsOptions = {}): string {
    return initialsValue(value, options);
  },
};
