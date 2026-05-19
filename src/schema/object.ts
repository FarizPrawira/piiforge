import type {
  Masker,
  MaskShape,
  ObjectMasker,
  ObjectMaskerOptions,
} from '../types.js';
import { redactValue } from '../maskers/redact.js';

export function object<Shape extends MaskShape>(
  shape: Shape,
  options: ObjectMaskerOptions = {},
): ObjectMasker<Shape> {
  const strict = options.strict ?? false;
  return {
    _type: 'object',
    shape,
    options: { strict },
    apply(value: unknown): unknown {
      if (value === null || value === undefined) return value;
      if (typeof value !== 'object' || Array.isArray(value)) return redactValue(value);

      const input = value as Record<string, unknown>;
      const output: Record<string, unknown> = {};

      if (!strict) {
        for (const key of Object.keys(input)) {
          if (!(key in shape)) {
            output[key] = input[key];
          }
        }
      }

      for (const key of Object.keys(shape)) {
        const masker = shape[key] as Masker<unknown, unknown>;
        output[key] = masker.apply(input[key]);
      }

      return output;
    },
  };
}
