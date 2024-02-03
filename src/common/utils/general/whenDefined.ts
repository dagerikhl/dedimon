export const whenDefined = <T = any>(
  x: T | null | undefined,
  type?: string,
): T | undefined => {
  const isDefined = x !== null && x !== undefined;

  if (type !== undefined) {
    if (!(typeof x === type && isDefined)) {
      throw new Error(`Unable to parse type ${x} as ${type}`);
    }

    return x;
  }

  return x ?? undefined;
};
