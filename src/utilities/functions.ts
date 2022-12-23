//  If the value is a function, it will call it else returns the value
export const call = <T = unknown, P = unknown>(
  valueOrFn: T | ((...props: Array<P>) => T),
  ...props: Array<P>
): T => {
  if (typeof valueOrFn === "function") {
    const fn = valueOrFn as (...props: Array<P>) => T;
    return fn.apply(props);
  }
  return valueOrFn;
};
