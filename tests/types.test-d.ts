import { describe, it, expectTypeOf } from 'vitest';
import { x } from '../src/schema/namespace.js';
import type { Infer } from '../src/types.js';

describe('type inference', () => {
  it('infers object shape with concrete leaf types', () => {
    const userMask = x.object({
      email: x.email(),
      phone: x.keep({ end: 4 }),
      fullName: x.keep({ start: 1, end: 1 }),
      bio: x.truncate(140),
      password: x.redact(),
      age: x.passthrough<number>(),
      birthYear: x.fn<number>((v) => Math.floor(v / 10) * 10),
    });
    type User = Infer<typeof userMask>;
    expectTypeOf<User>().toEqualTypeOf<{
      email: string;
      phone: string;
      fullName: string;
      bio: string;
      password: string;
      age: number;
      birthYear: number;
    }>();
  });

  it('infers nested objects and arrays', () => {
    const mask = x.object({
      tags: x.array(x.passthrough<string>()),
      address: x.object({
        city: x.passthrough<string>(),
        zip: x.keep({ end: 2 }),
      }),
    });
    type Out = Infer<typeof mask>;
    expectTypeOf<Out>().toEqualTypeOf<{
      tags: string[];
      address: { city: string; zip: string };
    }>();
  });
});
