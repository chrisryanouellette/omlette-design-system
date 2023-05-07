export const isUniqueSet = <T>(a: Set<T>, b: Set<T>): boolean => {
  if (a.size !== b.size) {
    return false;
  }
  return Array.from(b).some((element) => {
    return !a.has(element);
  });
};
