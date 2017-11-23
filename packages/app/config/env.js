// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.

const REACT_APP = /^REACT_APP_/i;
const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development');
const LOCAL_SERVER = !!JSON.stringify(process.env.LOCAL_SERVER);

const getHost = () => {
  if (LOCAL_SERVER) {
    return 'http://localhost:3000';
  }

  if (process.env.NODE_ENV === 'development') {
    return '*';
  }

  if ('STAGING_BRANCH' in process.env) {
    return `http://${process.env.STAGING_BRANCH}.cs.lbogdan.tk`;
  }

  return 'https://codesandbox.io';
};

module.exports = Object.keys(process.env)
  .filter(key => REACT_APP.test(key))
  .reduce(
    (env, key) => {
      env['process.env.' + key] = JSON.stringify(process.env[key]);
      return env;
    },
    {
      'process.env.NODE_ENV': NODE_ENV,
      'process.env.CODESANDBOX_HOST': JSON.stringify(getHost()),
      'process.env.LOCAL_SERVER': !!LOCAL_SERVER,
      'process.env.STAGING': 'STAGING_BRANCH' in process.env,
    }
  );
