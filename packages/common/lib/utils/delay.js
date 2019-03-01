'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
function delay(timeout = 1000) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
exports.default = delay;
