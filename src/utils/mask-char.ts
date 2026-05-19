export const DEFAULT_MASK_CHAR = '*';

export function maskMiddle(
  value: string,
  keepStart: number,
  keepEnd: number,
  maskLen: number,
  char: string = DEFAULT_MASK_CHAR,
): string {
  const head = value.slice(0, keepStart);
  const tail = keepEnd > 0 ? value.slice(value.length - keepEnd) : '';
  return head + char.repeat(maskLen) + tail;
}
