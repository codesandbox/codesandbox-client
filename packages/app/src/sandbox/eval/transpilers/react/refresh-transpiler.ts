import { LoaderContext, Transpiler } from 'sandpack-core';

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

const enqueueUpdate = () => {
  try {
    Refresh.performReactRefresh()
  } catch (e) {
    module.hot.decline();
    throw e;
  }
}

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

// When this signature changes, it's unsafe to stop at this refresh boundary.
function getRefreshBoundarySignature(moduleExports) {
  const signature = [];
  signature.push(Refresh.getFamilyByType(moduleExports));
  if (moduleExports == null || typeof moduleExports !== 'object') {
    // Exit if we can't iterate over exports.
    // (This is important for legacy environments.)
    return signature;
  }
  for (const key in moduleExports) {
    if (key === '__esModule') {
      continue;
    }
    const desc = Object.getOwnPropertyDescriptor(moduleExports, key);
    if (desc && desc.get) {
      continue;
    }
    const exportValue = moduleExports[key];
    signature.push(key);
    signature.push(Refresh.getFamilyByType(exportValue));
  }
  return signature;
};

function shouldInvalidateReactRefreshBoundary(
  prevExports,
  nextExports,
) {
  const prevSignature = getRefreshBoundarySignature(prevExports);
  const nextSignature = getRefreshBoundarySignature(nextExports);
  if (prevSignature.length !== nextSignature.length) {
    return true;
  }
  for (let i = 0; i < nextSignature.length; i++) {
    if (prevSignature[i] !== nextSignature[i]) {
      return true;
    }
  }
  return false;
};

var registerExportsForReactRefresh = (moduleExports, moduleID) => {
  Refresh.register(moduleExports, moduleID + ' %exports%');
  if (moduleExports == null || typeof moduleExports !== 'object') {
    // Exit if we can't iterate over exports.
    // (This is important for legacy environments.)
    return;
  }
  for (const key in moduleExports) {
    const desc = Object.getOwnPropertyDescriptor(moduleExports, key);
    if (desc && desc.get) {
      // Don't invoke getters as they may have side effects.
      continue;
    }
    const exportValue = moduleExports[key];
    const typeID = moduleID + ' %exports% ' + key;
    Refresh.register(exportValue, typeID);
  }
};

module.exports = {
  enqueueUpdate: debounce(enqueueUpdate, 30),
  isReactRefreshBoundary,
  registerExportsForReactRefresh,
  shouldInvalidateReactRefreshBoundary
};
`.trim();

// const getWrapperCode = (sourceCode: string) =>
//   `
// var prevRefreshReg = window.$RefreshReg$;
// var prevRefreshSig = window.$RefreshSig$;
// var RefreshRuntime = require('react-refresh/runtime');

// window.$RefreshReg$ = (type, id) => {
//   // Note module.id is webpack-specific, this may vary in other bundlers
//   const fullId = module.id + ' ' + id;
//   RefreshRuntime.register(type, fullId);
// }
// window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;

// try {
//   ${sourceCode}
// } finally {
//   window.$RefreshReg$ = prevRefreshReg;
//   window.$RefreshSig$ = prevRefreshSig;
// }

// const _csbRefreshUtils = require('${HELPER_PATH}');

// const isHotUpdate = !!module.hot.data;
// const prevExports = isHotUpdate ? module.hot.data.prevExports : null;
// if (_csbRefreshUtils.isReactRefreshBoundary) {
//   if (_csbRefreshUtils.isReactRefreshBoundary(module.exports)) {
//     _csbRefreshUtils.registerExportsForReactRefresh(module.exports, module.id)
//     const currentExports = { ...module.exports };

//     module.hot.dispose(function hotDisposeCallback(data) {
//       data.prevExports = currentExports;
//     });

//     if (isHotUpdate && _csbRefreshUtils.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
//       module.hot.invalidate();
//     } else {
//       module.hot.accept();
//     }

//     _csbRefreshUtils.enqueueUpdate();
//   } else if (isHotUpdate && _csbRefreshUtils.isReactRefreshBoundary(prevExports)) {
//     module.hot.invalidate();
//   }
// }
// `;

/**
 * This is the compressed version of the code in the comment above. We compress the code
 * to a single line so we don't mess with the source mapping when showing errors.
 */
const getWrapperCode = (sourceCode: string) =>
  `var prevRefreshReg=window.$RefreshReg$,prevRefreshSig=window.$RefreshSig$,RefreshRuntime=require("react-refresh/runtime");window.$RefreshReg$=(e,r)=>{const s=module.id+" "+r;RefreshRuntime.register(e,s)},window.$RefreshSig$=RefreshRuntime.createSignatureFunctionForTransform;try{${sourceCode}
}finally{window.$RefreshReg$=prevRefreshReg,window.$RefreshSig$=prevRefreshSig}const _csbRefreshUtils=require("${HELPER_PATH}"),isHotUpdate=!!module.hot.data,prevExports=isHotUpdate?module.hot.data.prevExports:null;if(_csbRefreshUtils.isReactRefreshBoundary)if(_csbRefreshUtils.isReactRefreshBoundary(module.exports)){_csbRefreshUtils.registerExportsForReactRefresh(module.exports,module.id);const e={...module.exports};module.hot.dispose((function(r){r.prevExports=e})),isHotUpdate&&_csbRefreshUtils.shouldInvalidateReactRefreshBoundary(prevExports,e)?module.hot.invalidate():module.hot.accept(),_csbRefreshUtils.enqueueUpdate()}else isHotUpdate&&_csbRefreshUtils.isReactRefreshBoundary(prevExports)&&module.hot.invalidate();`;

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
