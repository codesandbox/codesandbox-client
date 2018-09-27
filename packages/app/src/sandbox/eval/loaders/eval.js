// @flow
import buildProcess from './utils/process';

/* eslint-disable no-unused-vars */
export default function(
  code: string,
  require: Function,
  module: Object,
  env: Object = {},
  globals: Object = {},
  { asUMD = false }: { asUMD: boolean } = {}
) {
  const g = typeof window === 'undefined' ? self : window;
  const exports = module.exports;

  const global = g;
  const process = buildProcess(env);
  g.global = global;

  const globalsCode = ', ' + Object.keys(globals).join(', ');
  const globalsValues = Object.keys(globals).map(k => globals[k]);
  try {
    const newCode = `(function evaluate(require, module, exports, process, setImmediate, global${globalsCode}) {${code}\n})`;
    // eslint-disable-next-line no-eval
    (0, eval)(newCode).apply(this, [
      require,
      asUMD ? undefined : module,
      asUMD ? undefined : exports,
      process,
      requestAnimationFrame,
      asUMD ? undefined : global,
      ...globalsValues,
    ]);

    return module.exports;
  } catch (e) {
    let error = e;
    if (typeof e === 'string') {
      error = new Error(e);
    }
    error.isEvalError = true;

    throw error;
  }
}
/* eslint-enable no-unused-vars */
