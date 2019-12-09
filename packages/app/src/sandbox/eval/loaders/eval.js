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

const hasGlobalDeclaration = /^const global/m;

/* eslint-disable no-unused-vars */
export default function(
  code: string,
  require: Function,
  module: Object,
  env: Object = {},
  globals: Object = {},
  { asUMD = false }: { asUMD: boolean } = {}
) {
  const { exports } = module;

  const global = g;
  const process = buildProcess(env);
  g.global = global;

  const allGlobals = {
    require,
    module,
    exports,
    process,
    setImmediate: requestFrame,
    global,
    ...globals,
  };

  if (asUMD) {
    delete allGlobals.module;
    delete allGlobals.exports;
    delete allGlobals.global;
  }

  if (hasGlobalDeclaration.test(code)) {
    delete allGlobals.global;
  }

  const allGlobalKeys = Object.keys(allGlobals);
  const globalsCode = allGlobalKeys.length ? allGlobalKeys.join(', ') : '';
  const globalsValues = allGlobalKeys.map(k => allGlobals[k]);
  try {
    const newCode = `(function evaluate(` + globalsCode + `) {` + code + `\n})`;
    // eslint-disable-next-line no-eval
    (0, eval)(newCode).apply(this, globalsValues);

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
