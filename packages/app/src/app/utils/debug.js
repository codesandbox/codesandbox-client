const getDebugger = () => {
  if (process.env.NODE_ENV === 'production') {
    // Return a debugger that will log to sentry
    return (key: string) => (message: string) => {
      if (typeof window.Raven === 'object') {
        try {
          Raven.captureBreadcrumb({
            message: `${key} - ${message}`,
            category: 'logging',
          });
        } catch (e) {
          console.error(e);
        }
      }
    };
  }

  const debug = require('debug'); // eslint-disable-line global-require
  debug.enable('cs:*');
  return debug;
};

export default getDebugger();
