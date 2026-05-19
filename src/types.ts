export interface Masker<TIn = unknown, TOut = TIn> {
  readonly _type: string;
  apply(value: TIn): TOut;
}

export type MaskShape = Record<string, Masker<any, any>>;

export interface ObjectMaskerOptions {
  strict?: boolean;
}

export interface ObjectMasker<Shape extends MaskShape>
  extends Masker<unknown, unknown> {
  readonly _type: 'object';
  readonly shape: Shape;
  readonly options: ObjectMaskerOptions;
}

export interface ArrayMasker<Item extends Masker<any, any>>
  extends Masker<unknown, unknown> {
  readonly _type: 'array';
  readonly item: Item;
}

export type MaskCharOptions = { char?: string };

export type Infer<M extends Masker<any, any>> =
  M extends ObjectMasker<infer S>
    ? { [K in keyof S]: Infer<S[K]> }
    : M extends ArrayMasker<infer I>
      ? Array<Infer<I>>
      : M extends Masker<any, infer Out>
        ? Out
        : never;
