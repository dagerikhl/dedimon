export const camelCaseToTitleCase = (str: string): string =>
  str
    .replace(/([a-z])([A-Z])/g, (_$0, $1, $2) => `${$1} ${$2.toUpperCase()}`)
    .replace(/^([a-z])/, (_$0, $1) => $1.toUpperCase());
