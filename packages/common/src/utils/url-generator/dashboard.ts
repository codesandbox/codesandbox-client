export const DASHBOARD_URL_PREFIX = '/dashboard';
export const ALL_SANDBOXES_URL_PREFIX = `${DASHBOARD_URL_PREFIX}/sandboxes`;

function appendTeamIdQueryParam(url: string, teamId?: string | null) {
  if (teamId) {
    return `${url}?workspace=${teamId}`;
  }

  return url;
}

function sanitizePath(path: string) {
  return path
    .split('/')
    .map(p => p.split(' ').map(encodeURIComponent).join(' '))
    .join('/');
}

export const sandboxes = (path: string, teamId?: string | null) =>
  appendTeamIdQueryParam(
    `${ALL_SANDBOXES_URL_PREFIX}${sanitizePath(path)}`,
    teamId
  );

export const drafts = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/drafts`, teamId);

export const myContributions = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/my-contributions`, teamId);

export const repositories = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/repositories`, teamId);

export const repository = ({
  owner,
  name,
  teamId,
}: {
  owner: string;
  name: string;
  teamId?: string | null;
}) =>
  appendTeamIdQueryParam(
    `${DASHBOARD_URL_PREFIX}/repositories/github/${owner}/${name}`,
    teamId
  );

export const syncedSandboxes = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/synced-sandboxes`, teamId);

export const alwaysOn = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/always-on`, teamId);

export const templates = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/templates`, teamId);

export const recent = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/recent`, teamId);

export const archive = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/archive`, teamId);

export const shared = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/shared`, teamId);

export const liked = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/liked`, teamId);

export const settings = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/settings`, teamId);

export const registrySettings = (teamId?: string | null) =>
  appendTeamIdQueryParam(
    `${DASHBOARD_URL_PREFIX}/settings/npm-registry`,
    teamId
  );

export const permissionSettings = (teamId?: string | null) =>
  appendTeamIdQueryParam(
    `${DASHBOARD_URL_PREFIX}/settings/permissions`,
    teamId
  );

export const search = (query: string, teamId?: string | null) => {
  let searchUrl = appendTeamIdQueryParam(
    `${DASHBOARD_URL_PREFIX}/search`,
    teamId
  );

  if (searchUrl.includes('?')) {
    searchUrl += '&';
  } else {
    searchUrl += '?';
  }

  searchUrl += `query=${query}`;

  return searchUrl;
};

export const discover = (teamId?: string | null, albumId?: string) => {
  if (albumId) {
    return appendTeamIdQueryParam(
      `${DASHBOARD_URL_PREFIX}/discover/${albumId}`,
      teamId
    );
  }

  return appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/discover`, teamId);
};

export const discoverSearch = (query: string, teamId?: string | null) => {
  let searchUrl = appendTeamIdQueryParam(
    `${DASHBOARD_URL_PREFIX}/discover/search`,
    teamId
  );

  if (searchUrl.includes('?')) searchUrl += '&';
  else searchUrl += '?';

  searchUrl += `query=${query}`;

  return searchUrl;
};
