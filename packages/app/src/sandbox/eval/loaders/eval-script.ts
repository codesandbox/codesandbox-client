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

function loadScriptSync(code) {
  var s = document.createElement('script');
  s.innerHTML = code;
  s.type = 'text/javascript';
  s.async = false; // <-- this is important
  s.setAttribute('crossorigin', true);
  document.getElementsByTagName('head')[0].appendChild(s);
}

const hasGlobalDeclaration = /^const global/m;
let scriptCount = 0;

/* eslint-disable no-unused-vars */
export default function(
  code: string,
  require: Function,
  module: object,
  env: object = {},
  globals: object = {},
  { asUMD = false }: { asUMD: boolean } = {}
) {
  const exports = module.exports;

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
    const globalIdentifier = `csbScript${scriptCount++}`;
    const newCode =
      `window.${globalIdentifier} = (function evaluate(` +
      globalsCode +
      `) {` +
      code +
      `\n})`;

    // eslint-disable-next-line no-eval
    loadScriptSync(newCode);

    window[globalIdentifier].apply(this, globalsValues);

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
