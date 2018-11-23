// @flow
import buildProcess from './utils/process';

const g = typeof window === 'undefined' ? self : window;
const requestFrame = (() => {
  const raf =
    g.requestAnimationFrame ||
    g.mozRequestAnimationFrame ||
    g.webkitRequestAnimationFrame ||
    function(fn) {
      return g.setTimeout(fn, 20);
    };
  return function(fn) {
    return raf(fn);
  };
})();

/* eslint-disable no-unused-vars */
export default function(
  code: string,
  require: Function,
  module: Object,
  env: Object = {},
  globals: Object = {},
  { asUMD = false, inScope = false }: { asUMD: boolean, inScope: boolean } = {}
) {
  const exports = module.exports;

  const global = g;
  const process = buildProcess(env);
  g.global = global;

  const globalsCode = Object.keys(globals).length
    ? ', ' + Object.keys(globals).join(', ')
    : '';
  const globalsValues = Object.keys(globals).map(k => globals[k]);
  try {
    if (inScope) {
      // eslint-disable-next-line no-eval
      const value = eval(code);
      module.exports = value;
      return value;
    }

    const newCode =
      `(function evaluate(require, module, exports, process, setImmediate, global` +
      globalsCode +
      `) {` +
      code +
      `\n})`;
    // eslint-disable-next-line no-eval
    (0, eval)(newCode).apply(
      this,
      [
        require,
        asUMD ? undefined : module,
        asUMD ? undefined : exports,
        process,
        requestFrame,
        asUMD ? undefined : global,
      ].concat(globalsValues)
    );

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
