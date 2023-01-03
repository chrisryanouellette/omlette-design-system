import { CSSProperties } from "react";

/**
 * Returns an objects key if the value is truthy or returns a truthy value.
 * @param {Object} arg - The oject to be processed
 * @return {Object}
 *
 * @example
 * const style = styles({
 *  backgroundColor: true && "red"
 *  borderColor: false && "green"
 * })
 * // Output
 * { backgroundColor: "red" }
 */
const styles = (arg: {
  [key: string]: string | number | false | undefined;
}): CSSProperties => {
  const styles: Record<string, string | number> = {};
  Object.entries(arg).forEach(([key, value]) => {
    if (value !== undefined && value !== false) {
      styles[key] = value;
    }
  });
  return styles;
};

export { styles };
