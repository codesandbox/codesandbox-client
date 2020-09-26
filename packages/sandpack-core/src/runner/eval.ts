import { getGlobal } from '@codesandbox/common/lib/utils/global';
import buildProcess from './utils/process';

const g = getGlobal();
const requestFrame = (() => {
  const raf =
    g.requestAnimationFrame ||
    // @ts-ignore
    g.mozRequestAnimationFrame ||
    g.webkitRequestAnimationFrame ||
    function (fn: () => void) {
      return g.setTimeout(fn, 20);
    };
  return function (fn: (time: number) => void) {
    return raf(fn);
  };
})();

const hasGlobalDeclaration = /^const global/m;

/* eslint-disable no-unused-vars */
export default function (
  code: string,
  require: Function,
  module: { exports: any },
  env: Object = {},
  globals: Object = {},
  { asUMD = false }: { asUMD?: boolean } = {}
) {
  const { exports } = module;

  const global = g;
  const process = buildProcess(env);
  // @ts-ignore
  g.global = global;

  const allGlobals: { [key: string]: any } = {
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
    // @ts-ignore
    (0, eval)(newCode).apply(this, globalsValues); // eslint-disable-line no-eval

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
