const LOCAL_SERVER = !!JSON.stringify(process.env.LOCAL_SERVER);

module.exports = () => {
  if (LOCAL_SERVER) {
    return 'http://localhost:3000';
  }

  if (process.env.NODE_ENV === 'development') {
    return 'https://codesandbox.dev';
  }

  if ('STAGING_BRANCH' in process.env) {
    return `http://${process.env.STAGING_BRANCH}.cs.lbogdan.tk`;
  }

  if ('ROOT_URL' in process.env) {
    return process.env.ROOT_URL;
  }

  return 'https://codesandbox.io';
};
