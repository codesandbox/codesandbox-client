// eslint-disable-next-line react/jsx-no-useless-fragment
import CUSTOM_DOMAIN from '../onprem';

const IS_LOCAL_SERVER = Boolean(JSON.stringify(process.env.LOCAL_SERVER));
export default () => {
  if (CUSTOM_DOMAIN) {
    return `https://${CUSTOM_DOMAIN}`;
  }

  if ('SANDPACK' in process.env) {
    return '';
  }

  if (IS_LOCAL_SERVER) {
    return 'http://localhost:3000';
  }

  if (process.env.NODE_ENV === 'development') {
    return 'https://codesandbox.test';
  }

  if ('STAGING_BRANCH' in process.env) {
    return `https://${process.env.STAGING_BRANCH}.build.csb.dev`;
  }

  return 'https://codesandbox.io';
};
