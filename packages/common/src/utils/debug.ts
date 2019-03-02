const getDebugger = () => {
  if (
    process.env.NODE_ENV === 'production' &&
    typeof document !== 'undefined' &&
    document.location.search.indexOf('debug') === -1
  ) {
    const global = window as any;
    // Return a debugger that will log to sentry
    return (key: string) => (message: string) => {
      if (typeof global.Raven === 'object') {
        try {
          global.Raven.captureBreadcrumb({
            message: `${key} - ${message}`,
            category: 'logging',
          });
        } catch (e) {
          console.error(e);
        }
      }
    };
  }

  // @ts-ignore
  const debug = require('debug'); // eslint-disable-line global-require
  debug.enable('cs:*');
  return debug;
};

export default getDebugger();
