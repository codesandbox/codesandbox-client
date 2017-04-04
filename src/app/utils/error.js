export default function logError(err, { level = 'error', service = '' } = {}) {
  // eslint-disable-next-line
  Raven.captureException(err, {
    level,
    extra: {
      service,
    },
  });
  /* eslint no-console:0 */
  window.console && console.error && console.error(err);
}
