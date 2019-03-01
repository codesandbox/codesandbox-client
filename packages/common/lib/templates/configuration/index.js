'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// @flow
const package_json_1 = require('./package-json');
const prettierRC_1 = require('./prettierRC');
const sandbox_1 = require('./sandbox');
const babelrc_1 = require('./babelrc');
const now_1 = require('./now');
const angular_cli_1 = require('./angular-cli');
const angular_json_1 = require('./angular-json');
const tsconfig_1 = require('./tsconfig');
const babel_transpiler_1 = require('./babel-transpiler');
const custom_codesandbox_1 = require('./custom-codesandbox');
const configs = {
  babelrc: babelrc_1.default,
  babelTranspiler: babel_transpiler_1.default,
  packageJSON: package_json_1.default,
  prettierRC: prettierRC_1.default,
  sandboxConfig: sandbox_1.default,
  angularCli: angular_cli_1.default,
  angularJSON: angular_json_1.default,
  tsconfig: tsconfig_1.default,
  customCodeSandbox: custom_codesandbox_1.default,
  nowConfig: now_1.default,
};
exports.default = configs;
