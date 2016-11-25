const getDebugger = () => {
  if (process.env.NODE_ENV !== 'development') return () => () => {};

  const debug = require('debug'); // eslint-disable-line global-require
  debug.enable('cs:*');
  return debug;
};

export default getDebugger();
