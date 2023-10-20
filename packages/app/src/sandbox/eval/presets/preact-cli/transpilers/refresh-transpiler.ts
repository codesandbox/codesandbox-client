/**
 The MIT License (MIT)

Copyright (c) 2020-2021 Jovi De Croock
Copyright (c) 2021-Present Preact Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
// https://github.dev/preactjs/prefresh/blob/main/packages/webpack/src/index.js

import { LoaderContext, Transpiler } from 'sandpack-core';

const HELPER_PATH = '/node_modules/csbbust/prefresh-utils.js';

const HELPER_CODE = `const { isComponent, flush } = require('@prefresh/utils');

// eslint-disable-next-line
const getExports = m => m.exports || m.__proto__.exports;

function isSafeExport(key) {
  return (
    key === '__esModule' ||
    key === '__N_SSG' ||
    key === '__N_SSP' ||
    key === 'config'
  );
}

function registerExports(moduleExports, moduleId) {
  self['__PREFRESH__'].register(moduleExports, moduleId + ' %exports%');
  if (moduleExports == null || typeof moduleExports !== 'object') return;

  for (const key in moduleExports) {
    if (isSafeExport(key)) continue;
    const exportValue = moduleExports[key];
    const typeID = moduleId + ' %exports% ' + key;
    self['__PREFRESH__'].register(exportValue, typeID);
  }
}

const shouldBind = m => {
  let isCitizen = false;
  const moduleExports = getExports(m);

  if (isComponent(moduleExports)) {
    isCitizen = true;
  }

  if (
    moduleExports === undefined ||
    moduleExports === null ||
    typeof moduleExports !== 'object'
  ) {
    isCitizen = isCitizen || false;
  } else {
    for (const key in moduleExports) {
      if (key === '__esModule') continue;

      const exportValue = moduleExports[key];
      if (isComponent(exportValue)) {
        isCitizen = isCitizen || true;
      }
    }
  }

  return isCitizen;
};

module.exports = Object.freeze({
  getExports,
  shouldBind,
  flush,
  registerExports,
});
`.trim();

const NAMESPACE = '__PREFRESH__';

const beforeModule = `
var prevRefreshReg = self.$RefreshReg$;
var prevRefreshSig = self.$RefreshSig$;

self.$RefreshSig$ = function() {
  var status = 'begin';
  var savedType;
  return function(type, key, forceReset, getCustomHooks) {
    if (!savedType) savedType = type;
    status = self.${NAMESPACE}.sign(type || savedType, key, forceReset, getCustomHooks, status);
    return type;
  };
};

self.$RefreshReg$ = function(type, id) {
  self.${NAMESPACE}.register(type, module.id + ' ' + id);
};

try {
`;

const afterModule = `
} finally {
  self.$RefreshReg$ = prevRefreshReg;
  self.$RefreshSig$ = prevRefreshSig;
}
`;

const hotCode = `const __prefresh_utils__ = require("${HELPER_PATH}")
const isPrefreshComponent = __prefresh_utils__.shouldBind(module);
const moduleHot = module.hot;

if (moduleHot) {
  const currentExports = __prefresh_utils__.getExports(module);
  const previousHotModuleExports =
    moduleHot.data && moduleHot.data.moduleExports;

  __prefresh_utils__.registerExports(currentExports, module.id);

  if (isPrefreshComponent) {
    if (previousHotModuleExports) {
      try {
        __prefresh_utils__.flush();
        if (
          typeof __prefresh_errors__ !== 'undefined' &&
          __prefresh_errors__ &&
          __prefresh_errors__.clearRuntimeErrors
        ) {
          __prefresh_errors__.clearRuntimeErrors();
        }
      } catch (e) {
        // Only available in newer webpack versions.
        if (moduleHot.invalidate) {
          moduleHot.invalidate();
        } else {
          self.location.reload();
        }
      }
    }

    moduleHot.dispose(data => {
      data.moduleExports = __prefresh_utils__.getExports(module);
    });

    moduleHot.accept(function errorRecovery() {
      if (
        typeof __prefresh_errors__ !== 'undefined' &&
        __prefresh_errors__ &&
        __prefresh_errors__.handleRuntimeError
      ) {
        __prefresh_errors__.handleRuntimeError(error);
      }

      require.cache[module.id].hot.accept(errorRecovery);
    });
  }
}`.trim()

/**
 * This is the compressed version of the code in the comment above. We compress the code
 * to a single line so we don't mess with the source mapping when showing errors.
 */
const getWrapperCode = (sourceCode: string) =>
  beforeModule + sourceCode + '\n' + afterModule;

class RefreshTranspiler extends Transpiler {
  constructor() {
    super('prefresh-loader');
  }

  async doTranspilation(code: string, loaderContext: LoaderContext) {
    if (loaderContext.path.startsWith('/node_modules')) {
      return {
        transpiledCode: code,
      };
    }

    console.log('prefresh compile', loaderContext.path);

    // await loaderContext.addDependency('react-refresh/runtime');
    loaderContext.emitModule(HELPER_PATH, HELPER_CODE, '/', false, false);

    let newCode = getWrapperCode(code);
    newCode += '\n';
    newCode += hotCode;

    return {
      transpiledCode: newCode || '',
    };
  }
}

const transpiler = new RefreshTranspiler();

export { RefreshTranspiler };

export default transpiler;
