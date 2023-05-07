export const isUniqueSet = <T>(a: Set<T>, b: Set<T>): boolean => {
  if (a.size !== b.size) {
    return true;
  }
  return Array.from(b).some((element) => {
    return !a.has(element);
  });
};
