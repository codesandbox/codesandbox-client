export const DASHBOARD_URL_PREFIX = '/new-dashboard';
export const ALL_SANDBOXES_URL_PREFIX = `${DASHBOARD_URL_PREFIX}/all`;

function appendTeamIdQueryParam(url: string, teamId?: string) {
  if (teamId) {
    return `${url}?workspace=${teamId}`;
  }

  return url;
}

function sanitizePath(path: string) {
  return path
    .split('/')
    .map(p =>
      p
        .split(' ')
        .map(encodeURIComponent)
        .join(' ')
    )
    .join('/');
}

export const allSandboxes = (path: string, teamId?: string) =>
  appendTeamIdQueryParam(
    `${ALL_SANDBOXES_URL_PREFIX}${sanitizePath(path)}`,
    teamId
  );

export const drafts = (teamId?: string) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/drafts`, teamId);

export const templates = (teamId?: string) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/templates`, teamId);

export const recents = (teamId?: string) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/recent`, teamId);

export const deleted = (teamId?: string) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/deleted`, teamId);

export const home = (teamId?: string) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/home`, teamId);

export const settings = (teamId?: string) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/settings`, teamId);

export const teamInvite = (teamId?: string) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/settings/invite`, teamId);

export const createWorkspace = (teamId?: string) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/settings/new`, teamId);

export const search = (query: string, teamId?: string) => {
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
