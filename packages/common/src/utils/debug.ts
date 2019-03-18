import { getGlobal } from './global';

declare var __DEV__: boolean | undefined;

const shouldShowDebugger = () => {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return true;
  }

  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  if (
    typeof document !== 'undefined' &&
    document.location.search.includes('debug')
  ) {
    return true;
  }

  return false;
};

const getDebugger: () => (key: string) => (...message: any[]) => void = () => {
  if (!shouldShowDebugger()) {
    const global = getGlobal() as any;
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
