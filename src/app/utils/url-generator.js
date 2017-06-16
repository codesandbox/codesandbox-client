// @flow
export const host = () => {
  return process.env.NODE_ENV === 'production'
    ? 'codesandbox.io'
    : 'codesandbox.dev';
};

export const protocolAndHost = () => `${location.protocol}//${host()}`;

export const sandboxUrl = (sandbox: { id: string }) => `/s/${sandbox.id}`;
export const newSandboxUrl = () => `/s/new`;
export const embedUrl = (sandbox: { id: string }) => `/embed/${sandbox.id}`;

export const frameUrl = (append: string = '') => {
  if (process.env.LOCAL_SERVER) {
    return 'http://localhost:3001';
  }

  return `${location.protocol}//sandbox.${host()}/${append}`;
};

export const forkSandboxUrl = (sandbox: { id: string }) =>
  `${sandboxUrl(sandbox)}/fork`;

export const signInUrl = () => '/auth/github';

export const profileUrl = (username: string) => `/u/${username}`;
export const profileSandboxesUrl = (username: string, page?: number) =>
  `${profileUrl(username)}/sandboxes${page ? `/${page}` : ''}`;
export const profileLikesUrl = (username: string, page?: number) =>
  `${profileUrl(username)}/likes${page ? `/${page}` : ''}`;

export const optionsToParameterizedUrl = (options: Object) => {
  const keyValues = Object.keys(options)
    .map(key => `${key}=${options[key]}`)
    .join('&');

  if (keyValues.length === 0) return '';
  return `?${keyValues}`;
};
