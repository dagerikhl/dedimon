export const getDefinedString = (x: any): string | undefined => {
  if (typeof x === "string") {
    return x;
  }

  return undefined;
};
