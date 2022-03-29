import { LoaderContext, Transpiler } from 'sandpack-core';

const HELPER_PATH = '/node_modules/csbbust/refresh-helper.js';

const HELPER_CODE = `
const RefreshRuntime = require('react-refresh/runtime');

function debounce(fn, delay) {
  var handle;
  return () => {
    clearTimeout(handle);
    handle = setTimeout(fn, delay);
  };
}

const enqueueUpdate = debounce(() => {
  try {
    RefreshRuntime.performReactRefresh();
  } catch (e) {
    module.hot.decline();
    throw e;
  }
}, 30);

function isReactRefreshBoundary(moduleExports) {
  if (Object.keys(RefreshRuntime).length === 0) {
    return false;
  }

  if (RefreshRuntime.isLikelyComponentType(moduleExports)) {
    return true;
  }

  if (moduleExports == null || typeof moduleExports !== 'object') {
    /** Exit if we can't iterate over exports. */
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
      /** Don't invoke getters as they may have side effects. */
      return false;
    }

    const exportValue = moduleExports[key];
    if (!RefreshRuntime.isLikelyComponentType(exportValue)) {
      areAllExportsComponents = false;
    }
  }
  
  return hasExports && areAllExportsComponents;
};

/** When this signature changes, it's unsafe to stop at this refresh boundary. */
function getRefreshBoundarySignature(moduleExports) {
  const signature = [];
  signature.push(RefreshRuntime.getFamilyByType(moduleExports));
  if (moduleExports == null || typeof moduleExports !== 'object') {
    /** Exit if we can't iterate over exports. */
    /** (This is important for legacy environments.) */
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
    signature.push(RefreshRuntime.getFamilyByType(exportValue));
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
  RefreshRuntime.register(moduleExports, moduleID + ' %exports%');
  if (moduleExports == null || typeof moduleExports !== 'object') {
    /** Exit if we can't iterate over exports. */
    /** (This is important for legacy environments.) */
    return;
  }
  for (const key in moduleExports) {
    const desc = Object.getOwnPropertyDescriptor(moduleExports, key);
    if (desc && desc.get) {
      /** Don't invoke getters as they may have side effects. */
      continue;
    }
    const exportValue = moduleExports[key];
    const typeID = moduleID + ' %exports% ' + key;
    RefreshRuntime.register(exportValue, typeID);
  }
};

function prelude(module) {
  window.$RefreshReg$ = (type, id) => {
    /** Note module.id is webpack-specific, this may vary in other bundlers */
    const fullId = module.id + ' ' + id;
    RefreshRuntime.register(type, fullId);
  }
    
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}

function postlude(module) {
  const isHotUpdate = !!module.hot.data;
  const prevExports = isHotUpdate ? module.hot.data.prevExports : null;
  if (isReactRefreshBoundary(module.exports)) {
    registerExportsForReactRefresh(module.exports, module.id);
    const currentExports = { ...module.exports };

    module.hot.dispose(function hotDisposeCallback(data) {
      data.prevExports = currentExports;
    });

    if (isHotUpdate && shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {
      module.hot.invalidate();
    } else {
      module.hot.accept();
    }

    enqueueUpdate();
  } else if (isHotUpdate && isReactRefreshBoundary(prevExports)) {
    module.hot.invalidate();
  }
}

module.exports = {
  enqueueUpdate,
  isReactRefreshBoundary,
  registerExportsForReactRefresh,
  shouldInvalidateReactRefreshBoundary,
  prelude,
  postlude,
};
`.trim();

const prelude = `var _csbRefreshUtils = require("${HELPER_PATH}");
var prevRefreshReg = window.$RefreshReg$;
var prevRefreshSig = window.$RefreshSig$;
_csbRefreshUtils.prelude(module);
try {`.replace(/[\n]+/gm, '');

const postlude = `_csbRefreshUtils.postlude(module);
} finally {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}`.replace(/[\n]+/gm, '');

/**
 * This is the compressed version of the code in the comment above. We compress the code
 * to a single line so we don't mess with the source mapping when showing errors.
 */
const getWrapperCode = (sourceCode: string) =>
  prelude + sourceCode + '\n' + postlude;

class RefreshTranspiler extends Transpiler {
  constructor() {
    super('react-refresh-loader');
  }

  async doTranspilation(code: string, loaderContext: LoaderContext) {
    await loaderContext.addDependency('react-refresh/runtime');
    loaderContext.emitModule(HELPER_PATH, HELPER_CODE, '/', false, false);

    const newCode = getWrapperCode(code);

    return {
      transpiledCode: newCode || '',
    };
  }
}

const transpiler = new RefreshTranspiler();

export { RefreshTranspiler };

export default transpiler;
