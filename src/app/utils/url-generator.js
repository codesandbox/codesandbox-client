// @flow
export const host = () =>
  (process.env.NODE_ENV === 'production'
    ? 'codesandbox.io'
    : 'codesandbox.dev');

export const protocolAndHost = () => `${location.protocol}//${host()}`;

export const sandboxUrl = (sandbox: { id: string }) => `/s/${sandbox.id}`;
export const newSandboxUrl = () => `/s/new`;
export const embedUrl = (sandbox: { id: string }) => `/embed/${sandbox.id}`;

export const frameUrl = (append: string = '') =>
  `${location.protocol}//sandbox.${host()}/${append}`;

export const forkSandboxUrl = (sandbox: { id: string }) =>
  `${sandboxUrl(sandbox)}/fork`;

export const signInUrl = () => '/auth/github';

export const optionsToParameterizedUrl = (options: Object) => {
  const keyValues = Object.keys(options)
    .map(key => `${key}=${options[key]}`)
    .join('&');

  if (keyValues.length === 0) return '';
  return `?${keyValues}`;
};
