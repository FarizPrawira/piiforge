import { describe, it, expect } from 'vitest';
import { x } from '../src/index.js';

describe('immutability — deep snapshot', () => {
  it('does not mutate a nested object + array input across a full schema', () => {
    const mask = x.object({
      id: x.passthrough(),
      email: x.email(),
      phone: x.keep({ end: 4 }),
      password: x.redact(),
      address: x.object({
        street: x.redact(),
        city: x.passthrough(),
        zip: x.keep({ end: 2 }),
      }),
      tags: x.passthrough(),
      posts: x.array(
        x.object({
          title: x.passthrough(),
          secret: x.redact(),
        }),
      ),
    });

    const input = {
      id: 42,
      email: 'johndoe@mail.com',
      phone: '081234567890',
      password: 'hunter2',
      address: { street: '1 Main St', city: 'Jakarta', zip: '12345' },
      tags: ['admin', 'beta'],
      posts: [
        { title: 'hello', secret: 's1' },
        { title: 'world', secret: 's2' },
      ],
    };

    const snapshot = JSON.parse(JSON.stringify(input));
    const output = mask.apply(input);

    expect(input).toEqual(snapshot);
    expect(output).not.toBe(input);
  });
});
