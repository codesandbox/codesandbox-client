import preval from 'babel-plugin-preval/macro';

// This is .js for preval

const versionType = preval`module.exports = (() => {
  if (process.env.NODE_ENV === 'development') {
    return 'DEV';
  }
  if (process.env.STAGING_BRANCH) {
    return 'PR';
  }
  return 'PROD';
})()`;

const versionNumber = Math.floor(preval`module.exports = Date.now();` / 1000);

const shortCommitSha = preval(`
var execSync = require('child_process').execSync;
try {
  module.exports = execSync('git rev-parse --short HEAD').toString().trim();
} catch (e) {
  module.exports = 'unknown';
}
`);

export const getTimestamp = version => +version.split('-')[1];

export default preval(
  `module.exports = "${versionType}-${versionNumber}-${shortCommitSha}";`
);
