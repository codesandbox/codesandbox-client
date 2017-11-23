// @flow
import buildProcess from './utils/process';

/* eslint-disable no-unused-vars */
export default function(
  code: string,
  require: Function,
  exports: Object,
  env: Object = {}
) {
  const module = { exports: {} };
  const global = window;
  const process = buildProcess(env);
  window.global = global;

  try {
    const newCode = `(function evaluate(require, module, exports, process, global) {${
      code
    }\n})`;
    (0, eval)(newCode)(require, module, exports, process, global); // eslint-disable-line no-eval

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
