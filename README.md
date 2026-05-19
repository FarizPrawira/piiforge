# piiforge

[![npm version](https://img.shields.io/npm/v/piiforge.svg)](https://www.npmjs.com/package/piiforge)
[![npm downloads](https://img.shields.io/npm/dm/piiforge.svg)](https://www.npmjs.com/package/piiforge)
![zero dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)
![types included](https://img.shields.io/badge/types-included-blue)
[![license MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Declarative, type-safe JSON masking for TypeScript and JavaScript. Per-field strategies, composable schemas, static type inference.

- Per-field masking strategies â€” email becomes `j*****e@mail.com`, phone becomes `********7890`, password becomes `[REDACTED]`
- Composable schemas â€” describe a whole object once, reuse it anywhere
- Static type inference â€” `Infer<typeof schema>` produces the masked shape
- Immutable â€” every `apply()` returns a new object, inputs are never mutated
- Type-safe inputs â€” string maskers reject non-string inputs at compile time; runtime fallback redacts safely
- Strict mode â€” opt-in dropping of keys not declared in the schema
- Zero runtime dependencies, ESM + CJS, ships with TypeScript types
- Tiny surface â€” one `x` namespace, one `mask` namespace, one `Infer` type

```ts
import { x, mask } from 'piiforge';

// Mask one value, no schema.
mask.email('johndoe@mail.com');                   // 'j*****e@mail.com'
mask.keep('081234567890', { end: 4 });            // '********7890'
mask.keep('081234567890', { start: 2, end: 2 });  // '08********90'
mask.redact('hunter2');                           // '[REDACTED]'
mask.redact('hunter2', '****');                   // '****'
mask.truncate('long text here...', 8);            // 'long texâ€¦'

// Declarative schema for a whole object.
const userMask = x.object({
  id: x.passthrough(),
  email: x.email(),
  phone: x.keep({ end: 4 }),
  password: x.redact(),
  fullName: x.keep({ start: 1, end: 1 }),
});

userMask.apply({
  id: 42,
  email: 'johndoe@mail.com',
  phone: '081234567890',
  password: 'hunter2',
  fullName: 'JohnDoe',
});
// {
//   id: 42,
//   email: 'j*****e@mail.com',
//   phone: '********7890',
//   password: '[REDACTED]',
//   fullName: 'J*****e',
// }
```

## Install

```sh
npm install piiforge
# or
pnpm add piiforge
# or
yarn add piiforge
# or
bun add piiforge
```

Both ESM and CommonJS are shipped:

```ts
import { x, mask } from 'piiforge';            // ESM / TypeScript
const { x, mask } = require('piiforge');       // CommonJS
```

Requires Node 22+. Zero runtime dependencies. DevDeps (tsup, vitest, typescript) are not installed for consumers.

## Schema API

`x.object` and `x.array` compose into arbitrarily nested schemas. Every field declares how its value is masked.

```ts
import { x } from 'piiforge';

const userMask = x.object({
  id: x.passthrough(),
  email: x.email(),
  phone: x.keep({ end: 4 }),
  password: x.redact(),
  fullName: x.keep({ start: 1, end: 1 }),
  address: x.object({
    street: x.redact(),
    city: x.passthrough(),
    zip: x.keep({ end: 2 }),
  }),
  tags: x.passthrough(),
  posts: x.array(x.object({
    title: x.passthrough(),
    secretDraft: x.redact(),
  })),
});

const masked = userMask.apply(userData);
```

## Built-in maskers

| Function                       | Behavior                                                              | Example                                          |
| ------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------ |
| `x.passthrough()`              | Return value unchanged                                                | `'abc'` â†’ `'abc'`                                |
| `x.redact(replacement?)`       | Replace entire value with placeholder                                 | `'abc'` â†’ `'[REDACTED]'`                         |
| `x.keep({ start?, end?, maskLength? })` | Keep N chars at start/end, mask the rest                     | `'1234567890'` `{end: 4}` â†’ `'******7890'`       |
| `x.email({ start?, end?, maskLength? })` | Mask local part of an email, keep first & last char by default | `'johndoe@mail.com'` â†’ `'j*****e@mail.com'`  |
| `x.truncate(maxLen, suffix?)`  | Truncate string to max length, append suffix (default `â€¦`)            | `'long text'` `5` â†’ `'long â€¦'`                   |
| `x.creditCard({ keepLast? })`  | Mask digits in a card number, preserving separators and the last N digits | `'4111-2222-3333-4444'` â†’ `'****-****-****-4444'` |
| `x.initials({ separator?, trailing?, uppercase? })` | Reduce a name to its initials                            | `'John Doe'` â†’ `'J.D.'`                          |
| `x.fn(fn)`                     | Run a custom transform                                                | `(v) => v.toUpperCase()`                         |
| `x.object(shape, opts?)`       | Nested object masking (supports `{ strict: true }`)                   | See above                                        |
| `x.array(itemSchema)`          | Apply itemSchema to every element                                     | See above                                        |

Every string masker accepts a `{ char }` option to override the default `*`:

```ts
x.keep({ end: 4 }, { char: 'â€¢' }).apply('081234567890');
// 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢7890'
```

`maskLength` pins the number of mask characters regardless of input length â€” useful for hiding how long the original value was:

```ts
x.email({ start: 1, end: 1, maskLength: 3 }).apply('johnnnnnnnoe@mail.com');
// 'j***e@mail.com'
```

## TypeScript

```ts
import { x, type Infer } from 'piiforge';

const userMask = x.object({
  email: x.email(),
  phone: x.keep({ end: 4 }),
  age: x.passthrough<number>(),
});

type User = Infer<typeof userMask>;
// { email: string; phone: string; age: number }
```

The inferred type matches the masked output, so it composes with the rest of your type system without `as` casts.

## Recipes

### Custom masking with `x.fn`

```ts
const mask = x.object({
  birthYear: x.fn<number>((v) => Math.floor(v / 10) * 10), // 1987 â†’ 1980
  reversed: x.fn<string>((v) => v.split('').reverse().join('')),
});
```

### Strict mode â€” drop unknown keys

```ts
const m = x.object({ email: x.email() }, { strict: true });
m.apply({ email: 'a@b.com', password: 'secret' });
// { email: 'a@b.com' }   â€” password dropped, not just masked
```

### Arrays of objects

```ts
const postsMask = x.array(
  x.object({ title: x.passthrough(), secret: x.redact() })
);
```

## Rules

**`null` and `undefined` pass through unchanged on every masker.** Masking a non-existent value should not invent one.

```ts
x.email().apply(null);       // null
x.redact().apply(undefined); // undefined
```

**Type mismatches fall back to `redact()`.** If a string masker receives a non-string at runtime, it returns `[REDACTED]` rather than throwing. TypeScript also rejects the call at compile time.

```ts
// @ts-expect-error â€” keep expects a string
x.keep({ end: 4 }).apply(12345);   // '[REDACTED]'
```

**Schema keys missing from the input materialize as `undefined`.** Every key declared in `x.object(...)` appears in the output, even if the input didn't have it.

```ts
x.object({ email: x.email() }).apply({});   // { email: undefined }
```

**Non-strict mode (default) copies unknown keys through; strict mode drops them.**

```ts
const lax = x.object({ email: x.email() });
lax.apply({ email: 'a@b.com', extra: 'kept' });
// { email: 'a@b.com', extra: 'kept' }

const strict = x.object({ email: x.email() }, { strict: true });
strict.apply({ email: 'a@b.com', extra: 'dropped' });
// { email: 'a@b.com' }
```

**Apply is pure.** Inputs are never mutated. The output is always a new top-level object or array. Note that fields handled by `x.passthrough()` reuse the input reference â€” piiforge does not deep-clone.

**Invalid emails (no `@`) fall back to `redact()`.** Multiple `@` characters split on the last one (`'a@b@x.com'` â†’ local `'a@b'`, domain `'@x.com'`).

**`keep` and `email` return the value unchanged if there's nothing left to mask.** When `start + end >= value.length`, masking would reveal that there *was* something to hide. So nothing is changed.

## License

MIT
