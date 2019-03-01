'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const semver_1 = require('semver');
function isCRAVersion2(dependencies, devDependencies) {
  const reactScriptsVersion =
    dependencies['react-scripts'] || devDependencies['react-scripts'];
  if (reactScriptsVersion) {
    return (
      /^[a-z]/.test(reactScriptsVersion) ||
      semver_1.default.intersects(reactScriptsVersion, '^2.0.0')
    );
  }
  return false;
}
function isBabel7(dependencies = {}, devDependencies = {}) {
  if (devDependencies['@vue/cli-plugin-babel']) {
    return true;
  }
  if (devDependencies['@babel/core']) {
    return true;
  }
  if ('typescript' in devDependencies && !dependencies['@angular/core']) {
    return true;
  }
  if (isCRAVersion2(dependencies, devDependencies)) {
    return true;
  }
  return false;
}
exports.isBabel7 = isBabel7;
