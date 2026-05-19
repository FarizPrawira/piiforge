import { passthrough } from '../maskers/passthrough.js';
import { redact } from '../maskers/redact.js';
import { keep } from '../maskers/keep.js';
import { email } from '../maskers/email.js';
import { truncate } from '../maskers/truncate.js';
import { creditCard } from '../maskers/creditCard.js';
import { initials } from '../maskers/initials.js';
import { fn } from '../maskers/fn.js';
import { object } from './object.js';
import { array } from './array.js';
import type { Infer as InferType } from '../types.js';

export const x = {
  passthrough,
  redact,
  keep,
  email,
  truncate,
  creditCard,
  initials,
  fn,
  object,
  array,
};

export namespace x {
  export type Infer<M extends import('../types.js').Masker<any, any>> = InferType<M>;
}
