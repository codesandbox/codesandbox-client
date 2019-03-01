'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const macro_1 = require('babel-plugin-preval/macro');
const versionType = macro_1.default`module.exports = (() => {
  if (process.env.NODE_ENV === 'development') {
    return 'DEV';
  }
  if (process.env.STAGING_BRANCH) {
    return 'PR';
  }
  return 'PROD';
})()`;
const versionNumber = Math.floor(
  macro_1.default`module.exports = Date.now();` / 1000
);
const shortCommitSha = macro_1.default(`
var execSync = require('child_process').execSync;
try {
  module.exports = execSync('git rev-parse --short HEAD').toString().trim();
} catch (e) {
  module.exports = 'unknown';
}
`);
exports.getTimestamp = version => {
  return +version.split('-')[1];
};
exports.default = macro_1.default(
  `module.exports = "${versionType}-${versionNumber}-${shortCommitSha}";`
);
