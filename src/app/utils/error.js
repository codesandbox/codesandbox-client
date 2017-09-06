export default function logError(err, { level = 'error', service = '' } = {}) {
  Raven.captureException(err, {
    level,
    extra: {
      service,
    },
  });

  if (window.console && console.error) console.error(err);
}
