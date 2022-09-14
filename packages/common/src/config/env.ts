// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
import uuid from 'uuid';
import getHost from '../utils/host';

const REACT_APP = /^REACT_APP_/i;
const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development');
const LOCAL_SERVER = Boolean(JSON.stringify(process.env.LOCAL_SERVER));
const STAGING_API = Boolean(JSON.stringify(process.env.STAGING_API));

const AB_TESTING_URL_STAGING = 'https://ab-testing.codesandbox.stream';
const AB_TESTING_URL_PRODUCTION = 'https://ab-testing.codesandbox.io';
export const AB_TESTING_URL = /codesandbox\.io/.test(
  typeof window !== `undefined` ? window?.location?.host : ''
)
  ? AB_TESTING_URL_PRODUCTION
  : AB_TESTING_URL_STAGING;

export const getExperimentUserId = () => {
  const KEY_NAME = 'csb-ab-user-id';
  try {
    let userId = localStorage.getItem(KEY_NAME);

    if (!userId) {
      userId = uuid.v4();
      localStorage.setItem(KEY_NAME, userId);
    }

    return userId;
  } catch (e) {
    // localStorage is not available
    return uuid.v4();
  }
};

export default Object.keys(process.env)
  .filter(key => REACT_APP.test(key))
  .reduce(
    (env, key) => {
      env['process.env.' + key] = JSON.stringify(process.env[key]);
      return env;
    },
    {
      'process.env.NODE_ENV': NODE_ENV,
      'process.env.CSB': Boolean(process.env.CSB || false),
      'process.env.ENDPOINT': JSON.stringify(
        process.env.ENDPOINT || 'https://codesandbox.io'
      ),
      'process.env.STAGING_API': STAGING_API,
      'process.env.CODESANDBOX_HOST': JSON.stringify(getHost()),
      'process.env.LOCAL_SERVER': Boolean(LOCAL_SERVER),
      'process.env.STAGING': 'STAGING_BRANCH' in process.env,
      'process.env.VSCODE': Boolean(JSON.stringify(process.env.VSCODE)),
      'process.env.SANDPACK': Boolean(
        JSON.parse(process.env.SANDPACK || 'false')
      ),
      'process.env.DEV_DOMAIN': JSON.stringify(
        process.env.DEV_DOMAIN || 'codesandbox.test'
      ),
    }
  );
