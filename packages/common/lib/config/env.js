'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const host_1 = require('../utils/host');
const REACT_APP = /^REACT_APP_/i;
const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development');
const LOCAL_SERVER = !!JSON.stringify(process.env.LOCAL_SERVER);
exports.default = Object.keys(process.env)
  .filter(key => REACT_APP.test(key))
  .reduce(
    (env, key) => {
      env['process.env.' + key] = JSON.stringify(process.env[key]);
      return env;
    },
    {
      'process.env.NODE_ENV': NODE_ENV,
      'process.env.CODESANDBOX_HOST': JSON.stringify(host_1.default()),
      'process.env.LOCAL_SERVER': !!LOCAL_SERVER,
      'process.env.STAGING': 'STAGING_BRANCH' in process.env,
      'process.env.VSCODE': !!JSON.stringify(process.env.VSCODE),
    }
  );
