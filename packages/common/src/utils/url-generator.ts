import { Sandbox, SandboxUrlSourceData } from '../types';
import { isServer } from '../templates/helpers/is-server';
import * as dashboard from './url-generator/dashboard';

export const gitHubRepoPattern = /(https?:\/\/)?((www.)?)github.com(\/[\w-]+){2,}/;
const gitHubPrefix = /(https?:\/\/)?((www.)?)github.com/;
const dotGit = /(\.git)$/;

const sandboxHost = {
  'https://codesandbox.io': 'https://csb.app',
  'https://codesandbox.stream': 'https://codesandbox.dev',
};

const buildEncodedUri = (
  strings: TemplateStringsArray,
  ...values: Array<string>
) =>
  strings[0] +
  values
    .map((value, i) => `${encodeURIComponent(value)}${strings[i + 1]}`)
    .join('');

export const host = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.CODESANDBOX_HOST.split('//')[1];
  }
  if (process.env.LOCAL_SERVER) {
    return 'localhost:3000';
  }
  return process.env.DEV_DOMAIN;
};

export const protocolAndHost = () => `${location.protocol}//${host()}`;

export const newSandboxWizard = () => `/s`;
export const newSandboxUrl = () => `/s/new`;
export const parcelSandboxUrl = () => `/s/vanilla`;
export const newReactTypeScriptSandboxUrl = () => `/s/react-ts`;
export const newDojoSandboxUrl = () =>
  `/s/github/dojo/dojo-codesandbox-template`;
export const newPreactSandboxUrl = () => `/s/preact`;
export const newVueSandboxUrl = () => `/s/vue`;
export const importFromGitHubUrl = () => `/s/github`;
export const newSvelteSandboxUrl = () => `/s/svelte`;
export const newAngularSandboxUrl = () => `/s/angular`;
export const newCxJSSandboxUrl = () =>
  `/s/github/codaxy/cxjs-codesandbox-template`;
export const uploadFromCliUrl = () => `/s/cli`;

const sandboxGitUrl = (git: {
  repo: string;
  branch: string;
  username: string;
  path: string;
}) =>
  buildEncodedUri`github/${git.username}/${git.repo}/tree/${git.branch}/` +
  git.path;

export const editorUrl = () => `/s/`;

export const sandboxUrl = (sandboxDetails: SandboxUrlSourceData) => {
  if (sandboxDetails.git) {
    const { git } = sandboxDetails;
    return `${editorUrl()}${sandboxGitUrl(git)}`;
  }

  if (sandboxDetails.alias) {
    return `${editorUrl()}${sandboxDetails.alias}`;
  }

  return `${editorUrl()}${sandboxDetails.id}`;
};
export const embedUrl = (sandbox: Sandbox) => {
  if (sandbox.git) {
    const { git } = sandbox;
    return `/embed/${sandboxGitUrl(git)}`;
  }

  if (sandbox.alias) {
    return `/embed/${sandbox.alias}`;
  }

  return `/embed/${sandbox.id}`;
};

const stagingFrameUrl = (shortid: string, path: string) => {
  const stagingHost = (process.env.CODESANDBOX_HOST
    ? process.env.CODESANDBOX_HOST
    : ''
  ).split('//')[1];
  const segments = stagingHost.split('.');
  const first = segments.shift();
  return `${location.protocol}//${first}-${shortid}.${segments.join(
    '.'
  )}/${path}`;
};

export const frameUrl = (
  sandbox: Sandbox,
  append: string = '',
  {
    useFallbackDomain = false,
    port = undefined,
  }: { useFallbackDomain?: boolean; port?: number } = {}
) => {
  const path = append.indexOf('/') === 0 ? append.substr(1) : append;

  const templateIsServer = isServer(sandbox.template);

  if (process.env.LOCAL_SERVER) {
    return `http://localhost:3002/${path}`;
  }

  if (process.env.STAGING) {
    return stagingFrameUrl(sandbox.id, path);
  }

  let sHost = host();
  if (
    `https://${sHost}` in sandboxHost &&
    !useFallbackDomain &&
    !templateIsServer
  ) {
    sHost = sandboxHost[`https://${sHost}`].split('//')[1];
  }
  return `${location.protocol}//${sandbox.id}${port ? `-${port}` : ''}.${
    templateIsServer ? 'sse.' : ''
  }${sHost}/${path}`;
};

export const forkSandboxUrl = (sandbox: Sandbox) =>
  `${sandboxUrl(sandbox)}/fork`;

export const signInPageUrl = (redirectTo?: string) => {
  let url = `/signin`;

  if (redirectTo) {
    url += '?continue=' + redirectTo;
  }

  return url;
};

export const signInUrl = (extraScopes: boolean = false) =>
  '/auth/github' + (extraScopes ? '?scope=user:email,public_repo' : '');
export const signInVercelUrl = () => '/auth/vercel';

export const profileUrl = (username: string) => `/u/${username}`;
export const dashboardUrl = () => `/dashboard`;
export const exploreUrl = () => `/explore`;
export const teamOverviewUrl = (teamId: string) => `/dashboard/teams/${teamId}`;
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
  repo: string;
  branch: string;
  username: string;
  path: string;
}) =>
  buildEncodedUri`https://github.com/${username}/${repo}/tree/${branch}/` +
  path;

export const optionsToParameterizedUrl = (options: Object) => {
  const keyValues = Object.keys(options)
    .sort()
    .filter(a => options[a])
    .map(
      key => `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`
    )
    .join('&');

  return keyValues ? `?${keyValues}` : '';
};

export const gitHubToSandboxUrl = (githubUrl: string) =>
  githubUrl.replace(gitHubPrefix, '/s/github').replace(dotGit, '');

export const gitHubToSandboxBetaUrl = (githubUrl: string) =>
  githubUrl.replace(gitHubPrefix, '/github').replace(dotGit, '');

export const searchUrl = (query?: string) =>
  `/search${query ? `?query=${query}` : ''}`;
export const patronUrl = () => `/patron`;
export const curatorUrl = () => `/curator`;
export const tosUrl = () => `/legal/terms`;
export const privacyUrl = () => `/legal/privacy`;

export function getSandboxId() {
  const csbHost = process.env.CODESANDBOX_HOST;

  if (process.env.LOCAL_SERVER) {
    return document.location.hash.replace('#', '');
  }

  if (process.env.STAGING) {
    const segments = csbHost.split('//')[1].split('.');
    const first = segments.shift();
    const re = RegExp(`${first}-(.*)\\.${segments.join('\\.')}`);
    return document.location.host.match(re)[1];
  }

  let result: string;
  [csbHost, sandboxHost[csbHost]].filter(Boolean).forEach(tryHost => {
    const hostRegex = tryHost.replace(/https?:\/\//, '').replace(/\./g, '\\.');
    const sandboxRegex = new RegExp(`(.*)\\.${hostRegex}`);
    const matches = document.location.host.match(sandboxRegex);
    if (matches) {
      result = matches[1];
    }
  });

  if (!result) {
    throw new Error(`Can't detect sandbox ID from the current URL`);
  }

  return result;
}
export const teamInviteLink = (inviteToken: string) =>
  `${protocolAndHost()}/invite/${inviteToken}`;

export { dashboard };
