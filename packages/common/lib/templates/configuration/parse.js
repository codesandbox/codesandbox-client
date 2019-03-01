'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const jsonlint_1 = require('jsonlint');
function getCode(template, module, sandbox, resolveModule, configurationFile) {
  if (module) {
    return { code: module.code, generated: false };
  } else if (configurationFile.getDefaultCode) {
    return {
      code: configurationFile.getDefaultCode(template, resolveModule),
      generated: true,
    };
  } else if (sandbox && configurationFile.generateFileFromSandbox) {
    return {
      code: configurationFile.generateFileFromSandbox(sandbox),
      generated: true,
    };
  }
  return { code: '', generated: false };
}
/**
 * We convert all configuration file configs to an object with configuration per
 * type. This makes configs universal.
 */
function parseConfigurations(
  template,
  configurationFiles,
  resolveModule,
  sandbox
) {
  const configurations = {};
  const paths = Object.keys(configurationFiles);
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const module = resolveModule(path);
    const configurationFile = configurationFiles[path];
    const baseObject = Object.assign(
      { path },
      getCode(template, module, sandbox, resolveModule, configurationFile)
    );
    let code = null;
    if (code) {
      try {
        const parsed = jsonlint_1.parse(code);
        configurations[configurationFile.type] = Object.assign({}, baseObject, {
          parsed,
        });
      } catch (e) {
        configurations[configurationFile.type] = Object.assign({}, baseObject, {
          error: e,
        });
      }
    }
  }
  return configurations;
}
exports.default = parseConfigurations;
