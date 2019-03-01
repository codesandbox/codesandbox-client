'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const detect_old_browser_1 = require('./detect-old-browser');
function requirePolyfills() {
  const promises = [];
  if (
    detect_old_browser_1.default() ||
    typeof Object['entries'] === 'undefined'
  ) {
    promises.push(
      Promise.resolve().then(() =>
        require(/* webpackChunkName: 'polyfills' */ '@babel/polyfill')
      )
    );
  }
  if (typeof Error['captureStackTrace'] === 'undefined') {
    promises.push(
      Promise.resolve().then(() =>
        require(/* webpackChunkName: 'error-polyfill' */ 'error-polyfill')
      )
    );
  }
  return Promise.all(promises);
}
exports.default = requirePolyfills;
