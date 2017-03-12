export const host = () => (process.env.NODE_ENV === 'production' ? 'codesandbox.io' : 'codesandbox.dev');

export const sandboxUrl = sandbox => `/sandbox/${sandbox.shortid}`;

export const frameUrl = (append = '') => (
  `${location.protocol}//sandbox.${host()}/${append}`
);

export const forkSandboxUrl = sandbox => (
  `${sandboxUrl(sandbox)}/fork`
);
