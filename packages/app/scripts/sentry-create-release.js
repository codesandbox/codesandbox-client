/* eslint-disable no-console */
const childProcess = require('child_process');
const VERSION = require('@codesandbox/common/lib/version').default;

const COMMIT_HASH = childProcess
  .execSync('git rev-parse HEAD')
  .toString()
  .trim();

console.log('Marking this release in Sentry');
try {
  childProcess.execSync(
    `yarn sentry-cli releases --org=codesandbox -p client new "${VERSION}"`
  );
  childProcess.execSync(
    `yarn sentry-cli releases --org=codesandbox set-commits "${VERSION}" --commit "codesandbox/codesandbox-client@${COMMIT_HASH}"`
  );
  console.log('Marked release');
} catch (e) {
  console.error(e);
}
