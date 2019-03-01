'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const _1 = require('./');
const ui_1 = require('./prettierRC/ui');
const ui_2 = require('./sandbox/ui');
function getUI(configType) {
  switch (configType) {
    case _1.default.prettierRC.type: {
      return ui_1.default;
    }
    case _1.default.sandboxConfig.type: {
      return ui_2.default;
    }
    default: {
      return null;
    }
  }
}
exports.default = getUI;
