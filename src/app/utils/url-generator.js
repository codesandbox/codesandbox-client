// @flow
import type { Sandbox } from 'common/types';

export const host = () => {
  return process.env.NODE_ENV === 'production'
    ? 'codesandbox.io'
    : 'codesandbox.dev';
};

export const protocolAndHost = () => `${location.protocol}//${host()}`;

export const sandboxUrl = (sandbox: Sandbox) => {
  if (sandbox.git) {
    const { git } = sandbox;
    return `/s/github/${git.username}/${git.repo}/tree/${git.branch}/${git.path}`;
  }

  return `/s/${sandbox.id}`;
};
export const newSandboxUrl = () => `/s/new`;
export const embedUrl = (sandbox: Sandbox) => {
  if (sandbox.git) {
    const { git } = sandbox;
    return `/embed/github/${git.username}/${git.repo}/tree/${git.branch}/${git.path}`;
  }

  return `/embed/${sandbox.id}`;
};

export const frameUrl = (append: string = '') => {
  if (process.env.LOCAL_SERVER) {
    return 'http://localhost:3001';
  }

  return `${location.protocol}//sandbox.${host()}/${append}`;
};

export const forkSandboxUrl = (sandbox: Sandbox) =>
  `${sandboxUrl(sandbox)}/fork`;

export const signInUrl = () => '/auth/github';

export const profileUrl = (username: string) => `/u/${username}`;
export const profileSandboxesUrl = (username: string, page?: number) =>
  `${profileUrl(username)}/sandboxes${page ? `/${page}` : ''}`;
export const profileLikesUrl = (username: string, page?: number) =>
  `${profileUrl(username)}/likes${page ? `/${page}` : ''}`;

export const githubRepoUrl = ({
  repo,
  branch,
  username,
  path,
}: {
  repo: string,
  branch: string,
  username: string,
  path: string,
}) => `https://github.com/${username}/${repo}/tree/${branch}/${path}`;

export const optionsToParameterizedUrl = (options: Object) => {
  const keyValues = Object.keys(options)
    .map(key => `${key}=${options[key]}`)
    .join('&');

  if (keyValues.length === 0) return '';
  return `?${keyValues}`;
};
