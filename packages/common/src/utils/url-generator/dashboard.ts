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

export const templates = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/templates`, teamId);

export const recent = (
  teamId?: string | null,
  extraParams?: Record<string, string>
) => {
  let recentUrl = appendTeamIdQueryParam(
    `${DASHBOARD_URL_PREFIX}/recent`,
    teamId
  );

  if (extraParams && Object.keys(extraParams).length > 0) {
    const params = new URLSearchParams(extraParams);

    if (recentUrl.includes('?')) {
      recentUrl += '&';
    } else {
      recentUrl += '?';
    }

    recentUrl += params.toString();
  }

  return recentUrl;
};

export const getStarted = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/get-started`, teamId);

export const deleted = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/deleted`, teamId);

export const shared = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/shared`, teamId);

export const liked = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${DASHBOARD_URL_PREFIX}/liked`, teamId);

const portalBaseUrl = () => {
  const origin = process.env.ENDPOINT || window.location.origin;
  return `${origin}/t`;
};

export const portalOverview = (
  teamId?: string | null,
  params?: Record<string, string>
) => {
  if (!teamId) {
    return `${portalBaseUrl()}/overview`;
  }

  const url = appendTeamIdQueryParam(`${portalBaseUrl()}/overview`, teamId);
  const searchParams = new URLSearchParams(params);
  return `${url}&${searchParams.toString()}`;
};

export const portalRegistry = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${portalBaseUrl()}/registry`, teamId);

export const portalPermissions = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${portalBaseUrl()}/permissions`, teamId);

export const portalVMSettings = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${portalBaseUrl()}/vm_settings`, teamId);

export const portalVMUsage = (teamId?: string | null) =>
  appendTeamIdQueryParam(`${portalBaseUrl()}/usage`, teamId);

// This is used separately for checkout endpoints where the success/cancel paths need to be relative
export const portalRelativePath = (teamId?: string | null) =>
  appendTeamIdQueryParam(`/t/overview`, teamId);

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

type UpgradeParams = {
  workspaceId?: string;
  source?: string;
};

export const upgradeUrl = ({
  workspaceId,
  source,
}: UpgradeParams = {}): string => {
  const searchQuery = new URLSearchParams({});
  if (workspaceId) {
    searchQuery.set('workspace', workspaceId);
  }

  if (source) {
    searchQuery.set('utm_source', source);
  }

  const queryString = searchQuery.toString();
  return queryString ? `/upgrade?${queryString}` : '/upgrade';
};

export const createWorkspaceUrl = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const searchQuery = new URLSearchParams();
  if (workspaceId) {
    searchQuery.set('workspace', workspaceId);
  }
  const queryString = searchQuery.toString();
  return queryString ? `/create-workspace?${queryString}` : '/create-workspace';
};
