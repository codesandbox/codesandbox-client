const IS_LOCAL_SERVER = Boolean(JSON.stringify(process.env.LOCAL_SERVER));

export default () => {
  if ('SANDPACK' in process.env) {
    return '';
  }

  if (IS_LOCAL_SERVER) {
    return 'http://localhost:3000';
  }

  if (process.env.NODE_ENV === 'development') {
    return `https://${process.env.DEV_DOMAIN || 'codesandbox.test'}`;
  }

  if ('STAGING_BRANCH' in process.env) {
    return `https://${process.env.STAGING_BRANCH}.build.csb.dev`;
  }

  if ('ROOT_URL' in process.env) {
    return process.env.ROOT_URL;
  }

  return 'https://codesandbox.io';
};
