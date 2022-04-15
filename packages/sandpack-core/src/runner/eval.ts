/* eslint-disable no-eval */
import buildProcess from './utils/process';

const g = typeof window === 'undefined' ? self : window;

const hasGlobalDeclaration = /^const global/m;

const V8_VERSION = getV8Version();
function getV8Version(): string {
  const userAgent = navigator?.userAgent;
  if (userAgent) {
    let match = userAgent.match(/Edge\/(\d+)/);
    // @ts-ignore
    if (!match || match[1] >= 74) {
      match = userAgent.match(/Chrome\/(\d+)/);
      if (match) {
        return match[1];
      }
    }
  }
  return '0';
}

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
    const newCode =
      `(function $csb$eval(` + globalsCode + `) {` + code + `\n})`;
    // @ts-ignore
    (0, eval)(newCode).apply(allGlobals.global, globalsValues);

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
