import { getGlobal } from './global';

// eslint-disable-next-line
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
      // Disable it for now, seems to affect performance. That's the last thing we want
      // from this (https://github.com/codesandbox/codesandbox-client/issues/1671)

      // TODO: move this to sentry
      if (false || typeof global.Raven === 'object') {
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
  // debug.enable('cs:*');
  // debug.disable('cs:cp-*');
  return debug;
};

export default getDebugger();
