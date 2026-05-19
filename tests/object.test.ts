import { describe, it, expect } from 'vitest';
import { object } from '../src/schema/object.js';
import { array } from '../src/schema/array.js';
import { passthrough } from '../src/maskers/passthrough.js';
import { redact } from '../src/maskers/redact.js';
import { email } from '../src/maskers/email.js';
import { keep } from '../src/maskers/keep.js';

describe('object', () => {
  it('applies maskers per key', () => {
    const m = object({
      id: passthrough(),
      email: email(),
      password: redact(),
    });
    expect(m.apply({ id: 1, email: 'johndoe@mail.com', password: 'hunter2' })).toEqual({
      id: 1,
      email: 'j*****e@mail.com',
      password: '[REDACTED]',
    });
  });

  it('keeps unrelated keys in non-strict mode', () => {
    const m = object({ email: email() });
    expect(m.apply({ email: 'a@b.com', extra: 'kept' })).toEqual({
      email: 'a@b.com',
      extra: 'kept',
    });
  });

  it('drops unrelated keys in strict mode', () => {
    const m = object({ email: email() }, { strict: true });
    expect(m.apply({ email: 'a@b.com', password: 'secret' })).toEqual({
      email: 'a@b.com',
    });
  });

  it('handles nested objects', () => {
    const m = object({
      address: object({
        street: redact(),
        city: passthrough(),
        zip: keep({ end: 2 }),
      }),
    });
    expect(m.apply({ address: { street: '1 Main St', city: 'Jakarta', zip: '12345' } })).toEqual({
      address: { street: '[REDACTED]', city: 'Jakarta', zip: '***45' },
    });
  });

  it('passes through null and undefined', () => {
    const m = object({ x: redact() });
    expect(m.apply(null)).toBe(null);
    expect(m.apply(undefined)).toBe(undefined);
  });

  it('redacts on type mismatch', () => {
    const m = object({ x: redact() });
    expect(m.apply('not an object')).toBe('[REDACTED]');
  });

  it('does not mutate input', () => {
    const input = { email: 'johndoe@mail.com', age: 30 };
    const m = object({ email: email() });
    const output = m.apply(input);
    expect(output).not.toBe(input);
    expect(input.email).toBe('johndoe@mail.com');
  });

  it('materializes schema keys missing from input as undefined', () => {
    const m = object({ email: email(), password: redact() });
    expect(m.apply({})).toEqual({ email: undefined, password: undefined });
  });

  it('handles an empty schema in non-strict mode by copying input through', () => {
    expect(object({}).apply({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('handles an empty schema in strict mode by returning an empty object', () => {
    expect(object({}, { strict: true }).apply({ a: 1 })).toEqual({});
  });

  it('integrates with array combinator', () => {
    const m = object({
      posts: array(
        object({
          title: passthrough(),
          secret: redact(),
        }),
      ),
    });
    expect(
      m.apply({
        posts: [
          { title: 'a', secret: 's1' },
          { title: 'b', secret: 's2' },
        ],
      }),
    ).toEqual({
      posts: [
        { title: 'a', secret: '[REDACTED]' },
        { title: 'b', secret: '[REDACTED]' },
      ],
    });
  });

  it('runs the README quickstart example', () => {
    const userMask = object({
      id: passthrough(),
      email: email(),
      phone: keep({ end: 4 }),
      password: redact(),
      fullName: keep({ start: 1, end: 1 }),
    });
    expect(
      userMask.apply({
        id: 42,
        email: 'johndoe@mail.com',
        phone: '081234567890',
        password: 'hunter2',
        fullName: 'JohnDoe',
      }),
    ).toEqual({
      id: 42,
      email: 'j*****e@mail.com',
      phone: '********7890',
      password: '[REDACTED]',
      fullName: 'J*****e',
    });
  });
});
