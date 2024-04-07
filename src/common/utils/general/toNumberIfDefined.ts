export const toNumberIfDefined = (
  value: string | undefined,
  offset?: number,
): number | undefined => (value ? +value + (offset ?? 0) : undefined);
