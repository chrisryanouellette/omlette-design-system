/** Returns an objects key if the value is truthy or returns a truthy value
 * @param {Object} classes
 * @return {string[]} Classes with truth values
 * @example
 * classNames({
 *  "class-one": true,
 *  "class-two": false,
 *  "class-three": () => true
 * })
 * // Output
 * ["class-one", "class-three"]
 */
export const classNames = (classes: {
  [index: string]: boolean | undefined | (() => boolean | undefined);
}): string[] => {
  return Object.entries(classes)
    .filter(([, fnOrValue]) =>
      typeof fnOrValue === "function" ? fnOrValue() : fnOrValue
    )
    .map(([className]) => className);
};
