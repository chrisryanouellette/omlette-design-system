/**
 * If the value is a function, it will call it else returns the value
 * @param {Object | Function} valueOrFn
 * @param {any} props
 * @return {Object | Function}
 */
const call = (valueOrFn, ...props) => {
  if (typeof valueOrFn === "function") {
    const fn = valueOrFn;
    return fn.apply(props);
  }
  return valueOrFn;
};

module.exports = { call };
