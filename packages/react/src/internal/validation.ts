export function text(value: unknown, prop: string): asserts value is string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`OwlA11y: ${prop} must be non-empty text.`);
}
export function oneOf(value: string, allowed: readonly string[], prop: string) {
  if (!allowed.includes(value)) throw new Error(`OwlA11y: unsupported ${prop}: ${value}`);
}
export const classes = (...names: (string | undefined | false)[]) => names.filter(Boolean).join(' ');
export function describedBy(...values: (string | undefined)[]) {
  return [...new Set(values.flatMap(value => value?.trim().split(/\s+/).filter(Boolean) ?? []))].join(' ') || undefined;
}
