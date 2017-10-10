// @flow

/* eslint-disable no-unused-vars */
export default function(code: string, require: Function, exports) {
  const module = { exports: {} };
  const global = window;
  const process = { env: { NODE_ENV: 'development' } };

  try {
    eval(code); // eslint-disable-line no-eval

    // Choose either the export of __esModule or node
    return Object.keys(module.exports || {}).length > 0 ||
      (module.exports || {}).constructor !== Object ||
      (module.exports && !exports)
      ? module.exports
      : exports;
  } catch (e) {
    e.isEvalError = true;

    throw e;
  }
}
/* eslint-enable no-unused-vars */
