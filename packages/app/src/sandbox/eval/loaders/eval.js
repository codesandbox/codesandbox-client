// @flow
import buildProcess from './utils/process';

/* eslint-disable no-unused-vars */
export default function(
  code: string,
  require: Function,
  module: Object,
  env: Object = {},
  globals: Object = {}
) {
  const exports = module.exports;

  const global = window;
  const process = buildProcess(env);
  window.global = global;

  const globalsCode = ', ' + Object.keys(globals).join(', ');
  const globalsValues = Object.keys(globals).map(k => globals[k]);

  try {
    const newCode = `(function evaluate(require, module, exports, process, setImmediate, Buffer, global${
      globalsCode
    }) {${code}\n})`;
    // eslint-disable-next-line no-eval
    (0, eval)(newCode).apply(this, [
      require,
      module,
      exports,
      process,
      setImmediate,
      Buffer,
      global,
      ...globalsValues,
    ]);

    return module.exports;
  } catch (e) {
    e.isEvalError = true;

    throw e;
  }
}
/* eslint-enable no-unused-vars */
