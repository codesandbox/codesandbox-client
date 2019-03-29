/* eslint no-unused-vars: 0 */

const { format } = require('../');
const { combine, timestamp, label } = format;

const ignorePrivate = format((info, opts) => {
  if (info.private) { return false; }
  return info;
})();

console.dir(ignorePrivate.transform({
  level: 'error',
  message: 'Public error to share'
}));

console.dir(ignorePrivate.transform({
  level: 'error',
  private: true,
  message: 'This is super secret - hide it.'
}));

const willNeverThrow = format.combine(
  format(info => { return false; })(), // Ignores everything
  format(info => { throw new Error('Never reached'); })()
);

console.dir(willNeverThrow.transform({
  level: 'info',
  message: 'wow such testing'
}));
