export type StartsWith<T, b extends string> = T extends `${b}${infer f}`
  ? T
  : never;

export const startsWith = <T extends string, b extends string>(
  str: T,
  prefix: b
): str is StartsWith<T, b> => str.startsWith(prefix);
