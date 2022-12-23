export const isUniqueSet = <T>(a: Set<T>, b: Set<T>): boolean => {
  if (a.size !== b.size) {
    return Array.from(b).every((element) => {
      return !a.has(element);
    });
  }
  return false;
};
