// @flow
import buildProcess from './utils/process';

/* eslint-disable no-unused-vars */
export default function(
  code: string,
  require: Function,
  module: Object,
  env: Object = {}
) {
  const exports = module.exports;

  const global = window;
  const process = buildProcess(env);
  window.global = global;

  try {
    const newCode = `(function evaluate(require, module, exports, process, setImmediate, Buffer, global) {${
      code
    }\n})`;
    // eslint-disable-next-line no-eval
    (0, eval)(newCode)(
      require,
      module,
      exports,
      process,
      setImmediate,
      Buffer,
      global
    );

    return module.exports;
  } catch (e) {
    e.isEvalError = true;

    throw e;
  }
}
/* eslint-enable no-unused-vars */
