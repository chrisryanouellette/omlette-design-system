export const isElement = (elem: JSX.Element, options: string[]): boolean => {
  return (
    options.includes(elem.type) ||
    options.includes(elem.type.name) ||
    options.includes(elem.type.displayName)
  );
};
