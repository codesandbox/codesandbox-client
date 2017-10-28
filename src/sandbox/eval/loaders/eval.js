// @flow
import buildProcess from './utils/process';

/* eslint-disable no-unused-vars */
export default function(code: string, require: Function, exports) {
  const module = { exports: {} };
  const process = buildProcess();
  const global = window;
  window.global = global;

  try {
    const newCode = `(function evaluate(require, exports, module, process, global) {${code}
    })`;
    (0, eval)(newCode)(require, exports, module, process, global); // eslint-disable-line no-eval

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
