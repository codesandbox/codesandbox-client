import { LoaderContext } from 'sandbox/eval/transpiled-module';
import Transpiler from '..';

const HELPER_PATH = '/node_modules/csbbust/refresh-helper.js';

const HELPER_CODE = `
const Refresh = require('react-refresh/runtime');

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

const enqueueUpdate = debounce(Refresh.performReactRefresh, 30);

function isReactRefreshBoundary(moduleExports) {
  if (Object.keys(Refresh).length === 0) {
    return false;
  }

  if (Refresh.isLikelyComponentType(moduleExports)) {
    return true;
  }
  if (moduleExports == null || typeof moduleExports !== 'object') {
    // Exit if we can't iterate over exports.
    return false;
  }
  let hasExports = false;
  let areAllExportsComponents = true;
  for (const key in moduleExports) {
    hasExports = true;
    if (key === '__esModule') {
      continue;
    }
    const desc = Object.getOwnPropertyDescriptor(moduleExports, key);
    if (desc && desc.get) {
      // Don't invoke getters as they may have side effects.
      return false;
    }
    const exportValue = moduleExports[key];
    if (!Refresh.isLikelyComponentType(exportValue)) {
      areAllExportsComponents = false;
    }
  }
  return hasExports && areAllExportsComponents;
};

module.exports = {
  enqueueUpdate,
  isReactRefreshBoundary
};
`.trim();

/**
 * `var prevRefreshReg = window.$RefreshReg$;
var prevRefreshSig = window.$RefreshSig$;
var RefreshRuntime = require('react-refresh/runtime');

window.$RefreshReg$ = (type, id) => {
  // Note module.id is webpack-specific, this may vary in other bundlers
  const fullId = module.id + ' ' + id;
  RefreshRuntime.register(type, fullId);
}
window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;

try {
  ${sourceCode}
} finally {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}

const _csbRefreshUtils = require('${HELPER_PATH}');

if (_csbRefreshUtils.isReactRefreshBoundary(module.exports)) {
  module.hot.accept();
  _csbRefreshUtils.enqueueUpdate();
}
`
 */

/**
 * This is the compressed version of the code in the comment above. We compress the code
 * to a single line so we don't mess with the source mapping when showing errors.
 */
const getWrapperCode = (sourceCode: string) =>
  `var prevRefreshReg=window.$RefreshReg$,prevRefreshSig=window.$RefreshSig$,RefreshRuntime=require("react-refresh/runtime");window.$RefreshReg$=(a,b)=>{const c=module.id+" "+b;RefreshRuntime.register(a,c)},window.$RefreshSig$=RefreshRuntime.createSignatureFunctionForTransform;try{${sourceCode}
}finally{window.$RefreshReg$=prevRefreshReg,window.$RefreshSig$=prevRefreshSig}const _csbRefreshUtils=require("${HELPER_PATH}");_csbRefreshUtils.isReactRefreshBoundary(module.exports)&&(module.hot.accept(),_csbRefreshUtils.enqueueUpdate());
`.trim();

class RefreshTranspiler extends Transpiler {
  constructor() {
    super('refresh-loader');
  }

  doTranspilation(code: string, loaderContext: LoaderContext) {
    loaderContext.addDependency('react-refresh/runtime');
    loaderContext.emitModule(HELPER_PATH, HELPER_CODE, '/', false, false);

    const newCode = getWrapperCode(code);

    return Promise.resolve({
      transpiledCode: newCode || '',
    });
  }
}

const transpiler = new RefreshTranspiler();

export { RefreshTranspiler };

export default transpiler;
