'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.gitHubRepoPattern = /(https?:\/\/)?((www.)?)github.com(\/[\w-]+){2,}/;
const gitHubPrefix = /(https?:\/\/)?((www.)?)github.com/;
const dotGit = /(\.git)$/;
const buildEncodedUri = (strings, ...values) =>
  strings[0] +
  values
    .map((value, i) => `${encodeURIComponent(value)}${strings[i + 1]}`)
    .join('');
exports.host = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.CODESANDBOX_HOST.split('//')[1];
  }
  if (process.env.LOCAL_SERVER) {
    return 'localhost:3000';
  }
  return 'codesandbox.dev';
};
exports.protocolAndHost = () => `${location.protocol}//${exports.host()}`;
exports.newSandboxWizard = () => `/s`;
exports.newSandboxUrl = () => `/s/new`;
exports.parcelSandboxUrl = () => `/s/vanilla`;
exports.newReactTypeScriptSandboxUrl = () => `/s/react-ts`;
exports.newDojoSandboxUrl = () => `/s/github/dojo/dojo-codesandbox-template`;
exports.newPreactSandboxUrl = () => `/s/preact`;
exports.newVueSandboxUrl = () => `/s/vue`;
exports.importFromGitHubUrl = () => `/s/github`;
exports.newSvelteSandboxUrl = () => `/s/svelte`;
exports.newAngularSandboxUrl = () => `/s/angular`;
exports.newCxJSSandboxUrl = () => `/s/github/codaxy/cxjs-codesandbox-template`;
exports.uploadFromCliUrl = () => `/s/cli`;
const sandboxGitUrl = git =>
  buildEncodedUri`github/${git.username}/${git.repo}/tree/${git.branch}/` +
  git.path;
exports.sandboxUrl = sandbox => {
  if (sandbox.git) {
    const { git } = sandbox;
    return `/s/${sandboxGitUrl(git)}`;
  }
  return `/s/${sandbox.id}`;
};
exports.embedUrl = sandbox => {
  if (sandbox.git) {
    const { git } = sandbox;
    return `/embed/${sandboxGitUrl(git)}`;
  }
  return `/embed/${sandbox.id}`;
};
const stagingFrameUrl = (shortid, path) => {
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
exports.frameUrl = (shortid, append = '') => {
  const path = append.indexOf('/') === 0 ? append.substr(1) : append;
  if (process.env.LOCAL_SERVER) {
    return `http://localhost:3002/${path}`;
  }
  if (process.env.STAGING) {
    return stagingFrameUrl(shortid, path);
  }
  return `${location.protocol}//${shortid}.${exports.host()}/${path}`;
};
exports.forkSandboxUrl = sandbox => `${exports.sandboxUrl(sandbox)}/fork`;
exports.signInUrl = (extraScopes = false) =>
  '/auth/github' + (extraScopes ? '?scope=user:email,public_repo' : '');
exports.signInZeitUrl = () => '/auth/zeit';
exports.profileUrl = username => `/u/${username}`;
exports.dashboardUrl = () => `/dashboard`;
exports.exploreUrl = () => `/explore`;
exports.teamOverviewUrl = teamId => `/dashboard/teams/${teamId}`;
exports.profileSandboxesUrl = (username, page) =>
  `${exports.profileUrl(username)}/sandboxes${page ? `/${page}` : ''}`;
exports.profileLikesUrl = (username, page) =>
  `${exports.profileUrl(username)}/likes${page ? `/${page}` : ''}`;
exports.githubRepoUrl = ({ repo, branch, username, path }) =>
  buildEncodedUri`https://github.com/${username}/${repo}/tree/${branch}/` +
  path;
exports.optionsToParameterizedUrl = options => {
  const keyValues = Object.keys(options)
    .sort()
    .filter(a => options[a])
    .map(
      key => `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`
    )
    .join('&');
  return keyValues ? `?${keyValues}` : '';
};
exports.gitHubToSandboxUrl = githubUrl =>
  githubUrl.replace(gitHubPrefix, '/s/github').replace(dotGit, '');
exports.searchUrl = query => `/search${query ? `?query=${query}` : ''}`;
exports.patronUrl = () => `/patron`;
exports.curatorUrl = () => `/curator`;
exports.tosUrl = () => `/legal/terms`;
exports.privacyUrl = () => `/legal/privacy`;
