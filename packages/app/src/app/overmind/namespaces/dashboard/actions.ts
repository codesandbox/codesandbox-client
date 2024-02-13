import { compareDesc, parseISO } from 'date-fns';
import { json } from 'overmind';
import { Context } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';
import downloadZip from 'app/overmind/effects/zip/create-zip';
import { uniq } from 'lodash-es';
import {
  TemplateFragmentDashboardFragment,
  SandboxFragmentDashboardFragment,
  RepoFragmentDashboardFragment,
  CuratedAlbumByIdQueryVariables,
  ProjectFragment,
} from 'app/graphql/types';
import { v2BranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { NotificationStatus } from '@codesandbox/notifications';
import {
  getDecoratedCollection,
  getProjectUniqueKey,
  sortByLastAccessed,
} from './utils';

import { OrderBy, PageTypes, sandboxesTypes } from './types';
import * as internalActions from './internalActions';

export const internal = internalActions;

export const dashboardMounted = withLoadApp();

export const sandboxesSelected = (
  { state }: Context,
  {
    sandboxIds,
  }: {
    sandboxIds: string[];
  }
) => {
  state.dashboard.selectedSandboxes = sandboxIds;
};

export const setTrashSandboxes = (
  { state }: Context,
  {
    sandboxIds,
  }: {
    sandboxIds: string[];
  }
) => {
  state.dashboard.trashSandboxIds = sandboxIds;
};

export const dragChanged = (
  { state }: Context,
  { isDragging }: { isDragging: boolean }
) => {
  state.dashboard.isDragging = isDragging;
};

export const orderByReset = ({ state }: Context) => {
  if (
    state.dashboard.orderBy.field !== 'updatedAt' ||
    state.dashboard.orderBy.order !== 'desc'
  ) {
    state.dashboard.orderBy = {
      order: 'desc',
      field: 'updatedAt',
    };
  }
};

export const orderByChanged = ({ state }: Context, orderBy: OrderBy) => {
  state.dashboard.orderBy = orderBy;
};

export const blacklistedTemplateAdded = (
  { state }: Context,
  template: string
) => {
  state.dashboard.filters.blacklistedTemplates = state.dashboard.filters.blacklistedTemplates.concat(
    template
  );
};

export const blacklistedTemplateRemoved = (
  { state }: Context,
  template: string
) => {
  state.dashboard.filters.blacklistedTemplates = state.dashboard.filters.blacklistedTemplates.filter(
    currentTemplate => currentTemplate !== template
  );
};

export const blacklistedTemplatesCleared = ({ state }: Context) => {
  if (state.dashboard.filters.blacklistedTemplates.length) {
    state.dashboard.filters.blacklistedTemplates = [];
  }
};

export const blacklistedTemplatesChanged = (
  { state }: Context,
  templates: string[]
) => {
  state.dashboard.filters.blacklistedTemplates = templates;
};

export const searchChanged = (
  { state }: Context,
  { search }: { search: string }
) => {
  state.dashboard.filters.search = search;
};

export const viewModeChanged = (
  { state, effects }: Context,
  { mode }: { mode: 'grid' | 'list' }
) => {
  effects.analytics.track('Dashboard - Change View Mode', { mode });
  state.dashboard.viewMode = mode;
  effects.browser.storage.set('VIEW_MODE_DASHBOARD', mode);
};

export const deleteTemplate = async (
  { actions, effects, state }: Context,
  {
    sandboxId,
    templateId,
  }: {
    sandboxId: string;
    templateId: string;
  }
) => {
  const oldTemplates = {
    TEMPLATE_HOME: state.dashboard.sandboxes.TEMPLATE_HOME,
    TEMPLATES: state.dashboard.sandboxes.TEMPLATES,
  };
  actions.dashboard.deleteTemplateFromState([sandboxId]);

  try {
    effects.analytics.track('Template - Removed', { source: 'Context Menu' });
    await effects.api.deleteTemplate(sandboxId, templateId);
    actions.modalClosed();
    effects.notificationToast.success('Template Deleted');
  } catch (error) {
    state.dashboard.sandboxes.TEMPLATES = oldTemplates.TEMPLATES
      ? [...oldTemplates.TEMPLATES]
      : null;
    state.dashboard.sandboxes.TEMPLATE_HOME = oldTemplates.TEMPLATE_HOME
      ? [...oldTemplates.TEMPLATE_HOME]
      : null;
    effects.notificationToast.error('Could not delete custom template');
  }
};

export const getTeams = async ({ state, effects }: Context) => {
  if (!state.user) return;
  const teams = await effects.gql.queries.getTeams({});

  if (!teams || !teams.me) {
    return;
  }

  state.dashboard.teams = teams.me.workspaces;
  state.primaryWorkspaceId = teams.me.primaryWorkspaceId;
};

export const getAllFolders = async ({ state, effects }: Context) => {
  try {
    const data = await effects.gql.queries.getCollections({
      teamId: state.activeTeam,
    });
    if (!data || !data.me || !data.me.collections) {
      return;
    }

    // this is here because it will be done in the backend in the *FUTURE*
    const collectionsByLevel = data.me.collections.map(collection =>
      getDecoratedCollection(collection)
    );

    state.dashboard.allCollections = collectionsByLevel.filter(c => c.id);
  } catch {
    effects.notificationToast.error(
      'There was a problem getting your sandboxes'
    );
  }
};

export const createFolder = async (
  { effects, state }: Context,
  path: string
) => {
  if (!state.dashboard.allCollections) return;
  const oldFolders = state.dashboard.allCollections;
  state.dashboard.allCollections = [
    getDecoratedCollection({ id: 'FAKE_ID', path, sandboxCount: 0 }),
    ...state.dashboard.allCollections,
  ];
  try {
    const { createCollection } = await effects.gql.mutations.createFolder({
      // only way to pass, null is a value in the BE
      // @ts-ignore
      teamId: state.activeTeam || undefined,
      path,
    });

    state.dashboard.allCollections = state.dashboard.allCollections.map(
      folder => {
        if (folder.id === 'FAKE_ID') {
          return {
            ...folder,
            id: createCollection.id,
            path: createCollection.path,
          };
        }

        return folder;
      }
    );
  } catch {
    state.dashboard.allCollections = [...oldFolders];
    effects.notificationToast.error('There was a problem creating your folder');
  }
};

export const getDrafts = async ({ state, effects }: Context) => {
  const { dashboard, activeTeam } = state;
  try {
    let sandboxes: SandboxFragmentDashboardFragment[] = [];

    if (activeTeam) {
      const data = await effects.gql.queries.getTeamDrafts({
        teamId: state.activeTeam,
        authorId: null,
      });
      if (typeof data?.me?.team?.drafts === 'undefined') {
        return;
      }
      sandboxes = data.me.team.drafts;
    }

    dashboard.sandboxes[sandboxesTypes.DRAFTS] = sandboxes.filter(
      s => !s.customTemplate
    );
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your sandboxes'
    );
  }
};

export const getSandboxesByPath = async (
  { state, effects }: Context,
  path: string
) => {
  const { dashboard } = state;

  if (!state.activeTeam && (!path || path === '/')) {
    // For personal users we actually see the sandboxes in / as drafts. So we shouldn't
    // also show these sandboxes here.
    if (!dashboard.sandboxes.ALL) {
      dashboard.sandboxes.ALL = {};
    }
    dashboard.sandboxes.ALL[path] = [];
    return;
  }

  const cleanPath = path.split(' ').join('{}');
  try {
    const data = await effects.gql.queries.sandboxesByPath({
      path: '/' + path,
      teamId: state.activeTeam,
    });
    if (typeof data?.me?.collection?.sandboxes === 'undefined') {
      return;
    }

    if (!dashboard.sandboxes.ALL) {
      dashboard.sandboxes.ALL = {};
    }

    dashboard.sandboxes.ALL[cleanPath] = data.me.collection.sandboxes.filter(
      s => !s.customTemplate
    );
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your sandboxes'
    );
  }
};

export const getReposByPath = async (
  { state, effects }: Context,
  path: string
  // eslint-disable-next-line consistent-return
) => {
  const { dashboard } = state;
  try {
    if (path && dashboard.sandboxes.REPOS) {
      return;
    }
    let sandboxes: RepoFragmentDashboardFragment[] = [];
    if (state.activeTeam) {
      dashboard.sandboxes.REPOS = null;
      const teamData = await effects.gql.queries.getTeamRepos({
        id: state.activeTeam,
      });
      if (!teamData || !teamData.me || !teamData.me.team) {
        return;
      }
      sandboxes = teamData.me.team.sandboxes;
    }

    if (!sandboxes) {
      return;
    }

    if (!dashboard.sandboxes.REPOS) {
      dashboard.sandboxes.REPOS = {};
    }

    const repos = sandboxes.reduce((acc, curr) => {
      if (!curr.originalGit || !curr.originalGit.repo) return acc;
      if (acc[curr.originalGit.repo]) {
        const newSandboxes = acc[curr.originalGit.repo].sandboxes.concat(curr);
        acc[curr.originalGit.repo] = {
          ...acc[curr.originalGit.repo],
          sandboxes: newSandboxes,
          lastEdited: newSandboxes
            .map(s => parseISO(s.updatedAt))
            .sort(compareDesc)[0],
        };

        return acc;
      }

      acc[curr.originalGit.repo] = {
        id: curr.originalGit.id,
        name: curr.originalGit.repo,
        branch: curr.originalGit.branch,
        owner: curr.originalGit.username,
        path: '/' + curr.originalGit.repo,
        lastEdited: parseISO(curr.updatedAt),
        sandboxes: [curr],
      };

      return acc;
    }, {});
    dashboard.sandboxes.REPOS = repos;
  } catch (error) {
    effects.notificationToast.error('There was a problem getting your repos');
  }
};

export const getDeletedSandboxes = async ({ state, effects }: Context) => {
  const { dashboard } = state;

  if (!state.activeTeam) {
    return;
  }

  try {
    const data = await effects.gql.queries.deletedTeamSandboxes({
      teamId: state.activeTeam,
    });

    if (!data?.me?.team?.sandboxes) {
      return;
    }

    dashboard.sandboxes[sandboxesTypes.DELETED] = data?.me?.team?.sandboxes;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your deleted Sandboxes'
    );
  }
};

export const getTemplateSandboxes = async ({ state, effects }: Context) => {
  const { dashboard } = state;
  try {
    if (state.activeTeam) {
      dashboard.sandboxes[sandboxesTypes.TEMPLATES] = null;
      const data = await effects.gql.queries.teamTemplates({
        id: state.activeTeam,
      });

      if (!data || !data.me || !data.me.team) {
        return;
      }

      dashboard.sandboxes[sandboxesTypes.TEMPLATES] = data.me.team.templates;
    }
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your Templates'
    );
  }
};

export const getStartPageSandboxes = async ({ state, effects }: Context) => {
  const { dashboard } = state;

  try {
    const sandboxesResult = await effects.gql.queries.recentlyAccessedSandboxes(
      {
        limit: 18,
        teamId: state.activeTeam,
      }
    );

    const branchesResult = await effects.gql.queries.recentlyAccessedBranches({
      limit: 18,
      teamId: state.activeTeam,
    });

    dashboard.sandboxes.RECENT_SANDBOXES =
      sandboxesResult?.me?.recentlyAccessedSandboxes || [];
    dashboard.sandboxes.RECENT_BRANCHES =
      branchesResult?.me?.recentBranches || [];
  } catch (error) {
    dashboard.sandboxes.RECENT_SANDBOXES = [];
    dashboard.sandboxes.RECENT_BRANCHES = [];
    effects.notificationToast.error(
      'There was a problem getting your sandboxes'
    );
  }
};

export const deleteTemplateFromState = (
  { state: { dashboard } }: Context,
  ids: string[]
) => {
  const { sandboxes } = dashboard;
  ids.map(id => {
    if (sandboxes.TEMPLATE_HOME) {
      sandboxes.TEMPLATE_HOME = sandboxes.TEMPLATE_HOME
        ? sandboxes.TEMPLATE_HOME.filter(
            ({ sandbox }: TemplateFragmentDashboardFragment) =>
              sandbox && sandbox.id !== id
          )
        : null;
    }

    if (sandboxes.TEMPLATES) {
      sandboxes.TEMPLATES = sandboxes.TEMPLATES
        ? sandboxes.TEMPLATES.filter(
            ({ sandbox }: TemplateFragmentDashboardFragment) =>
              sandbox && sandbox.id !== id
          )
        : null;
    }

    return null;
  });
};

export const deleteSandbox = async (
  { state, effects, actions }: Context,
  {
    ids,
  }: {
    ids: string[];
  }
) => {
  const { user } = state;
  if (!user) return;

  effects.analytics.track('Dashboard - Delete Sandbox', {
    dashboardVersion: 2,
  });
  const oldSandboxes = state.dashboard.sandboxes;
  actions.dashboard.internal.deleteSandboxesFromState({ ids });

  try {
    await effects.gql.mutations.deleteSandboxes({
      sandboxIds: ids,
    });

    // Re-fetch team to get updated usage data
    actions.getActiveTeamInfo();
  } catch (error) {
    state.dashboard.sandboxes = { ...oldSandboxes };

    effects.notificationToast.error(
      'There was a problem deleting your Sandbox'
    );
  }
};

export const unmakeTemplates = async (
  { effects, actions, state }: Context,
  {
    templateIds,
    isOnRecentPage = false,
  }: { templateIds: string[]; isOnRecentPage?: boolean }
) => {
  const oldTemplates = {
    TEMPLATE_HOME: state.dashboard.sandboxes.TEMPLATE_HOME,
    TEMPLATES: state.dashboard.sandboxes.TEMPLATES,
  };
  try {
    await effects.gql.mutations.unmakeSandboxesTemplate({
      sandboxIds: templateIds,
    });
    if (isOnRecentPage) {
      actions.dashboard.getStartPageSandboxes();
    } else {
      actions.dashboard.deleteTemplateFromState(templateIds);
    }
  } catch (error) {
    state.dashboard.sandboxes.TEMPLATES = oldTemplates.TEMPLATES
      ? [...oldTemplates.TEMPLATES]
      : null;
    state.dashboard.sandboxes.TEMPLATE_HOME = oldTemplates.TEMPLATE_HOME
      ? [...oldTemplates.TEMPLATE_HOME]
      : null;
    effects.notificationToast.error(
      'There was a problem reverting your template'
    );
  }
};

export const renameFolderInState = (
  { state: { dashboard } }: Context,
  { path, newPath }: { path: string; newPath: string }
) => {
  if (!dashboard.allCollections) return;
  const newFolders = dashboard.allCollections.map(folder => {
    if (folder.path === path) {
      return getDecoratedCollection({ ...folder, path: newPath });
    }

    return folder;
  });
  dashboard.allCollections = newFolders;
};

export const renameSandbox = async (
  { effects, actions }: Context,
  {
    id,
    title,
  }: {
    id: string;
    title: string;
  }
) => {
  const {
    changedSandboxes,
  } = actions.dashboard.internal.changeSandboxesInState({
    sandboxIds: [id],
    sandboxMutation: sandbox => ({ ...sandbox, title }),
  });

  try {
    await effects.gql.mutations.renameSandbox({
      id,
      title,
    });
  } catch {
    changedSandboxes.forEach(oldSandbox =>
      actions.dashboard.internal.changeSandboxesInState({
        sandboxIds: [oldSandbox.id],
        sandboxMutation: sandbox => ({ ...sandbox, title: oldSandbox.title }),
      })
    );

    effects.notificationToast.error(
      'There was a problem renaming your sandbox'
    );
  }
};

export const moveFolder = async (
  { state: { dashboard }, actions, effects }: Context,
  {
    path,
    newPath,
    teamId,
    newTeamId,
  }: {
    path: string;
    newPath: string;
    newTeamId: string | null;
    teamId: string | null;
  }
) => {
  if (!dashboard.allCollections) return;

  effects.analytics.track('Dashboard - Move Folder', {
    dashboardVersion: 2,
  });
  actions.dashboard.renameFolder({ path, newPath, teamId, newTeamId });
};

export const renameFolder = async (
  { state: { dashboard }, effects, actions }: Context,
  {
    path,
    newPath,
    teamId,
    newTeamId,
  }: {
    path: string;
    newPath: string;
    newTeamId: string | null;
    teamId: string | null;
  }
) => {
  if (!dashboard.allCollections) return;
  actions.dashboard.renameFolderInState({
    path,
    newPath,
  });

  try {
    await effects.gql.mutations.renameFolder({
      path,
      newPath,
      teamId,
      newTeamId,
    });
  } catch {
    actions.dashboard.renameFolderInState({
      path: newPath,
      newPath: path,
    });
    effects.notificationToast.error('There was a problem renaming you folder');
  }
};

export const deleteFolder = async (
  { state: { dashboard, activeTeam }, effects }: Context,
  {
    path,
  }: {
    path: string;
  }
) => {
  if (!dashboard.allCollections) return;
  const oldCollections = dashboard.allCollections;
  dashboard.allCollections = dashboard.allCollections.filter(
    folder => folder.path !== path
  );
  try {
    await effects.gql.mutations.deleteFolder({
      path,
      // only way to pass, null is a value in the BE
      // @ts-ignore
      teamId: activeTeam || undefined,
    });
  } catch {
    dashboard.allCollections = oldCollections;
    effects.notificationToast.error('There was a problem deleting you folder');
  }
};

export const makeTemplates = async (
  { effects, state, actions }: Context,
  {
    sandboxIds: ids,
    isOnRecentPage = false,
  }: {
    sandboxIds: string[];
    isOnRecentPage?: boolean;
  }
) => {
  effects.analytics.track('Dashboard - Make Template', {
    dashboardVersion: 2,
  });

  const oldSandboxes = state.dashboard.sandboxes;

  try {
    await effects.gql.mutations.makeSandboxesTemplate({
      sandboxIds: ids,
    });

    if (isOnRecentPage) {
      actions.dashboard.getStartPageSandboxes();
    } else {
      actions.dashboard.internal.deleteSandboxesFromState({ ids });
    }

    const hadTemplatesBeforeFetching = state.sidebar.hasTemplates;
    await actions.sidebar.getSidebarData(state.activeTeam || undefined);

    if (!hadTemplatesBeforeFetching) {
      notificationState.addNotification({
        title: 'Template successfully created',
        message: 'Check out your new "Templates" collection in the sidebar.',
        status: NotificationStatus.SUCCESS,
      });
    }
  } catch (error) {
    state.dashboard.sandboxes = { ...oldSandboxes };
    effects.notificationToast.error('There was a problem making your template');
  }
};

export const permanentlyDeleteSandboxes = async (
  { effects, state }: Context,
  ids: string[]
) => {
  if (!state.dashboard.sandboxes.DELETED) return;

  effects.analytics.track('Dashboard - Permanent Delete Sandboxes', {
    dashboardVersion: 2,
  });

  const oldDeleted = state.dashboard.sandboxes.DELETED;
  state.dashboard.sandboxes.DELETED = oldDeleted.filter(
    sandbox => !ids.includes(sandbox.id)
  );
  try {
    await effects.gql.mutations.permanentlyDeleteSandboxes({ sandboxIds: ids });
  } catch (error) {
    state.dashboard.sandboxes.DELETED = [...oldDeleted];
    effects.notificationToast.error(
      'There was a problem deleting your sandbox'
    );
  }
};

export const recoverSandboxes = async (
  { effects, state }: Context,
  ids: string[]
) => {
  effects.analytics.track('Dashboard - Recover Sandboxes', {
    dashboardVersion: 2,
  });

  if (!state.dashboard.sandboxes.DELETED) return;
  const oldDeleted = state.dashboard.sandboxes.DELETED;
  state.dashboard.sandboxes.DELETED = oldDeleted.filter(
    sandbox => !ids.includes(sandbox.id)
  );
  try {
    await effects.gql.mutations.addSandboxToFolder({
      sandboxIds: ids,
      collectionPath: '/',
      // only way to pass, null is a value in the BE
      // @ts-ignore
      teamId: state.activeTeam || undefined,
    });
  } catch (error) {
    state.dashboard.sandboxes.DELETED = [...oldDeleted];
    effects.notificationToast.error(
      'There was a problem recovering your sandbox'
    );
  }
};

export const downloadSandboxes = async (
  { effects }: Context,
  ids: string[]
) => {
  effects.analytics.track('Dashboard - Download Sandboxes', {
    dashboardVersion: 2,
  });

  try {
    const sandboxIds = uniq(ids);
    const sandboxes = await Promise.all(
      sandboxIds.map(s => effects.api.getSandbox(s))
    );
    Promise.all(sandboxes.map(s => downloadZip(s, s.modules, s.directories)));
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem reverting your template'
    );
  }
};

export const getSearchSandboxes = async ({ state, effects }: Context) => {
  const { dashboard } = state;
  try {
    const activeTeam = state.activeTeam;

    let sandboxes: SandboxFragmentDashboardFragment[] = [];
    if (activeTeam) {
      const data = await effects.gql.queries.searchTeamSandboxes({
        teamId: activeTeam,
      });
      if (data?.me?.team?.sandboxes == null) {
        return;
      }

      sandboxes = data.me.team.sandboxes;
    }

    const sandboxesToShow = state.dashboard
      .getFilteredSandboxes(sandboxes)
      .filter(x => !x.customTemplate);

    dashboard.sandboxes[sandboxesTypes.SEARCH] = sandboxesToShow;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your sandboxes'
    );
  }
};

export const getPage = async (
  { actions, state }: Context,
  page: sandboxesTypes
) => {
  const { dashboard } = actions;

  switch (page) {
    case sandboxesTypes.RECENT:
      dashboard.getStartPageSandboxes();
      break;
    case sandboxesTypes.DELETED:
      dashboard.getDeletedSandboxes();
      break;
    case sandboxesTypes.DRAFTS:
      dashboard.getDrafts();
      break;
    case sandboxesTypes.TEMPLATES:
      dashboard.getTemplateSandboxes();
      break;
    case sandboxesTypes.SEARCH:
      dashboard.getSearchSandboxes();
      if (state.activeTeam) {
        dashboard.getRepositoriesByTeam({
          teamId: state.activeTeam,
        });
      }
      break;
    case sandboxesTypes.SHARED:
      dashboard.getSharedSandboxes();
      break;
    case sandboxesTypes.LIKED:
      dashboard.getLikedSandboxes();
      break;

    case sandboxesTypes.DISCOVER:
      dashboard.getCuratedAlbums();
      break;

    default:
      break;
  }
};

export const addSandboxesToFolder = async (
  { state, effects, actions }: Context,
  {
    sandboxIds,
    collectionPath,
    teamId = state.activeTeam,
    deleteFromCurrentPath = true,
  }: {
    sandboxIds: string[];
    collectionPath: string | null;
    teamId?: string | null;
    deleteFromCurrentPath?: boolean;
  }
) => {
  effects.analytics.track('Dashboard - Moved Sandboxes', {
    dashboardVersion: 2,
  });

  const existingCollection = state.dashboard?.allCollections?.find(
    f => f.path === collectionPath
  );
  if (existingCollection) {
    existingCollection.sandboxCount += sandboxIds.length;
  }

  if (teamId !== state.activeTeam) {
    effects.analytics.track('Dashboard - Moved Sandboxes to different team', {
      dashboardVersion: 2,
    });
  }

  try {
    await effects.gql.mutations.addSandboxToFolder({
      sandboxIds,
      collectionPath,
      teamId,
    });

    if (deleteFromCurrentPath) {
      actions.dashboard.internal.deleteSandboxesFromState({ ids: sandboxIds });
    }

    if (collectionPath) {
      // Prefetch that folder
      actions.dashboard.getSandboxesByPath(collectionPath.replace(/^\//, ''));
    } else {
      actions.dashboard.getPage(sandboxesTypes.DRAFTS);
    }

    // Re-fetch team to get updated usage data
    actions.getActiveTeamInfo();

    effects.notificationToast.success(
      'Successfully moved to ' +
        (collectionPath === '/'
          ? "'All sandboxes and devboxes'"
          : collectionPath)
    );
  } catch (e) {
    if (e.message.includes('SANDBOX_LIMIT')) {
      effects.notificationToast.error(
        'You reached the maximum amount of shareable Sandboxes in this workspace. Upgrade your plan to add more.'
      );
    } else {
      effects.notificationToast.error(
        'There was a problem moving your sandbox'
      );
    }
  }
};

export const createTeam = async (
  { effects }: Context,
  {
    teamName,
  }: {
    teamName: string;
  }
) => {
  // Do not try/catch to let errors propagate to `TeamInfo` that will
  // then handle it by showing a notification if creating a team fails.
  effects.analytics.track('Team - Create Team', { dashboardVersion: 2 });
  const { createTeam: newTeam } = await effects.gql.mutations.createTeam({
    name: teamName,
  });

  return newTeam;
};

export const renameCurrentTeam = async (
  { effects, state, actions }: Context,
  {
    name,
  }: {
    name: string;
  }
) => {
  if (!state.activeTeam) return;

  const oldTeamInfo = state.dashboard.teams.find(
    team => team.id === state.activeTeam
  );
  const oldActiveTeamInfo = state.activeTeamInfo;
  try {
    await effects.gql.mutations.setTeamName({
      name,
      // only way to pass, null is a value in the BE
      // @ts-ignore
      teamId: state.activeTeam,
    });

    state.dashboard.teams = state.dashboard.teams.map(team => {
      if (oldTeamInfo && team.id === oldTeamInfo.id) {
        return {
          ...team,
          name,
        };
      }

      return team;
    });

    if (oldActiveTeamInfo) {
      state.activeTeamInfo = {
        ...oldActiveTeamInfo,
        name,
      };
    }
  } catch (e) {
    if (oldActiveTeamInfo) {
      state.activeTeamInfo = { ...oldActiveTeamInfo };
    }
    if (state.dashboard.teams && oldTeamInfo) {
      state.dashboard.teams = [...state.dashboard.teams, oldTeamInfo];
    }
    actions.internal.handleError({
      message: 'There was a problem renaming your team',
      error: e,
    });
  }
};

export const changeSandboxesFrozen = async (
  { actions, effects }: Context,
  {
    sandboxIds,
    isFrozen,
  }: {
    sandboxIds: string[];
    isFrozen: boolean;
  }
) => {
  effects.analytics.track('Sandbox - Update Frozen', {
    isFrozen,
    source: 'dashboard',
    dashboardVersion: 2,
  });

  // optimistic update
  const {
    changedSandboxes,
  } = actions.dashboard.internal.changeSandboxesInState({
    sandboxIds,
    sandboxMutation: sandbox => ({ ...sandbox, isFrozen }),
  });

  try {
    await effects.gql.mutations.changeFrozen({ sandboxIds, isFrozen });
  } catch (error) {
    changedSandboxes.forEach(oldSandbox =>
      actions.dashboard.internal.changeSandboxesInState({
        sandboxIds: [oldSandbox.id],
        sandboxMutation: sandbox => ({
          ...sandbox,
          isFrozen: oldSandbox.isFrozen,
        }),
      })
    );

    actions.internal.handleError({
      message:
        "We weren't able to update the protected status of the sandboxes",
      error,
    });
  }
};

export const changeSandboxesPrivacy = async (
  { actions, effects }: Context,
  {
    sandboxIds,
    privacy,
  }: {
    sandboxIds: string[];
    privacy: 0 | 1 | 2;
  }
) => {
  effects.analytics.track('Sandbox - Update Privacy', {
    privacy,
    source: 'dashboard',
    dashboardVersion: 2,
  });

  // optimistic update
  const {
    changedSandboxes,
  } = actions.dashboard.internal.changeSandboxesInState({
    sandboxIds,
    sandboxMutation: sandbox => ({ ...sandbox, privacy }),
  });

  try {
    await effects.gql.mutations.changePrivacy({ sandboxIds, privacy });
  } catch (error) {
    changedSandboxes.forEach(oldSandbox => {
      actions.dashboard.internal.changeSandboxesInState({
        sandboxIds: [oldSandbox.id],
        sandboxMutation: s => ({ ...s, privacy: oldSandbox.privacy }),
      });
    });

    actions.internal.handleError({
      message: "We weren't able to update the sandbox privacy",
      error,
    });
  }
};

export const deleteWorkspace = async ({ actions, effects, state }: Context) => {
  if (!state.activeTeamInfo) return;

  try {
    await effects.gql.mutations.deleteWorkspace({ teamId: state.activeTeam });

    effects.router.redirectToDashboard();
    await actions.dashboard.getTeams();

    actions.internal.setFallbackWorkspace();

    effects.notificationToast.success(`Your workspace was deleted`);
  } catch (error) {
    // this is odd to handle it in the action
    // TODO: we need a cleaner way to read graphql errors
    const message = error.response?.errors[0]?.message;

    actions.internal.handleError({
      message: 'There was a problem deleting your workspace',
      error: { name: 'Delete workspace', message },
    });
  }
};

export const setTeamMinimumPrivacy = async (
  { state, effects }: Context,
  {
    teamId,
    minimumPrivacy,
    updateDrafts = false,
    source,
  }: {
    teamId: string;
    minimumPrivacy: SandboxFragmentDashboardFragment['privacy'];
    updateDrafts?: boolean;
    source: 'Dashboard' | 'Profiles';
  }
) => {
  effects.analytics.track('Team - Change minimum privacy', {
    minimumPrivacy,
    source,
  });

  try {
    await effects.gql.mutations.setTeamMinimumPrivacy({
      teamId,
      minimumPrivacy,
      updateDrafts,
    });

    const selectedTeam = state.dashboard.teams.find(team => team.id === teamId);

    if (selectedTeam && selectedTeam.settings) {
      selectedTeam.settings.minimumPrivacy = minimumPrivacy;
    }

    if (source === 'Dashboard') {
      effects.notificationToast.success('Minimum privacy updated.');
    }
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem updating your settings'
    );
  }
};

export const setPreventSandboxesLeavingWorkspace = async (
  { state, actions, effects }: Context,
  {
    sandboxIds,
    preventSandboxLeaving,
  }: {
    sandboxIds: string[];
    preventSandboxLeaving: boolean;
  }
) => {
  const {
    changedSandboxes,
  } = actions.dashboard.internal.changeSandboxesInState({
    sandboxIds,
    sandboxMutation: sandbox => ({
      ...sandbox,
      permissions: { ...sandbox.permissions, preventSandboxLeaving },
    }),
  });

  effects.analytics.track(`Dashboard - Change sandbox permissions`, {
    preventSandboxLeaving,
  });

  try {
    await effects.gql.mutations.setPreventSandboxesLeavingWorkspace({
      sandboxIds,
      preventSandboxLeaving,
    });

    effects.notificationToast.success('Sandbox permissions updated.');
  } catch (error) {
    changedSandboxes.forEach(oldSandbox =>
      actions.dashboard.internal.changeSandboxesInState({
        sandboxIds: [oldSandbox.id],
        sandboxMutation: sandbox => ({
          ...sandbox,
          permissions: { ...oldSandbox.permissions },
        }),
      })
    );
    effects.notificationToast.error(
      'There was a problem updating your sandbox permissions'
    );
  }
};

export const setPreventSandboxesExport = async (
  { state, actions, effects }: Context,
  {
    sandboxIds,
    preventSandboxExport,
  }: {
    sandboxIds: string[];
    preventSandboxExport: boolean;
  }
) => {
  // optimistic update
  const {
    changedSandboxes,
  } = actions.dashboard.internal.changeSandboxesInState({
    sandboxIds,
    sandboxMutation: sandbox => ({
      ...sandbox,
      permissions: { ...sandbox.permissions, preventSandboxExport },
    }),
  });

  effects.analytics.track(`Dashboard - Change sandbox permissions`, {
    preventSandboxExport,
  });

  try {
    await effects.gql.mutations.setPreventSandboxesExport({
      sandboxIds,
      preventSandboxExport,
    });

    effects.notificationToast.success('Sandbox permissions updated.');
  } catch (error) {
    changedSandboxes.forEach(oldSandbox =>
      actions.dashboard.internal.changeSandboxesInState({
        sandboxIds: [oldSandbox.id],
        sandboxMutation: sandbox => ({
          ...sandbox,
          permissions: { ...oldSandbox.permissions },
        }),
      })
    );
    effects.notificationToast.error(
      'There was a problem updating your sandbox permissions'
    );
  }
};

export const requestAccountClosing = ({ state }: Context) => {
  state.currentModal = 'accountClosing';
};
export const undoRequestAccountClosing = ({ state }: Context) => {
  state.currentModal = 'undoAccountClosing';
};

export const undoDeleteAccount = async ({ state, effects }: Context) => {
  try {
    await effects.gql.mutations.undoDeleteAccount({});
    state.currentModal = 'undoDeleteConfirmation';
    if (state.user) {
      state.user.deletionRequested = false;
    }
  } catch {
    effects.notificationToast.error(
      'There was a problem undoing your account deletion. Please email us at support@codesandbox.io'
    );
  }
};

export const deleteAccount = async ({ state, effects }: Context) => {
  try {
    await effects.gql.mutations.deleteAccount({});
    state.currentModal = 'deleteConfirmation';
  } catch {
    effects.notificationToast.error(
      'There was a problem requesting your account deletion. Please email us at support@codesandbox.io'
    );
  }
};

export const getSharedSandboxes = async ({ state, effects }: Context) => {
  const { dashboard } = state;
  try {
    const data = await effects.gql.queries.sharedWithmeSandboxes({});

    if (!data.me?.collaboratorSandboxes) {
      return;
    }

    dashboard.sandboxes[sandboxesTypes.SHARED] = data.me?.collaboratorSandboxes;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting Sandboxes shared with you'
    );
  }
};

export const getLikedSandboxes = async ({ state, effects }: Context) => {
  const { dashboard } = state;
  try {
    const data = await effects.gql.queries.likedSandboxes({});

    if (!data.me?.likedSandboxes) {
      return;
    }

    dashboard.sandboxes[sandboxesTypes.LIKED] = data.me?.likedSandboxes;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting liked Sandboxes'
    );
  }
};

export const unlikeSandbox = async (
  { state, effects }: Context,
  id: string
) => {
  const all = state.dashboard.sandboxes[sandboxesTypes.LIKED];
  if (!all) return;
  try {
    state.dashboard.sandboxes[sandboxesTypes.LIKED] = all.filter(
      sandbox => sandbox.id !== id
    );
    await effects.api.unlikeSandbox(id);
  } catch (e) {
    state.dashboard.sandboxes[sandboxesTypes.LIKED] = json(all);
    effects.notificationToast.error('There was a problem removing your like');
  }
};

export const likeCommunitySandbox = async (
  { actions, effects }: Context,
  id: string
) => {
  try {
    // we don't have optimistic updates because the shape of
    // a liked sandbox is not the same as a community sandbox
    // so we refetch liked sandboxes from the api
    await effects.api.likeSandbox(id);
    actions.dashboard.getLikedSandboxes();
  } catch (e) {
    effects.notificationToast.error('There was a problem liking the sandbox');
  }
};

export const getCuratedAlbums = async ({ state, effects }: Context) => {
  const { dashboard } = state;
  try {
    const data = await effects.gql.queries.curatedAlbums({});
    dashboard.curatedAlbums = data.curatedAlbums;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting curated collections'
    );
  }
};

export const getCuratedAlbumById = async (
  { state, effects }: Context,
  params: CuratedAlbumByIdQueryVariables
) => {
  const { dashboard } = state;
  const _curatedAlbumsById = dashboard.curatedAlbumsById ?? {};
  try {
    dashboard.curatedAlbumsById = {
      ..._curatedAlbumsById,
      [params.albumId]: null,
    };

    const data = await effects.gql.queries.curatedAlbumById(params);

    if (!data.album) {
      throw new Error('Unable to find the requested collection');
    }

    dashboard.curatedAlbumsById = {
      ..._curatedAlbumsById,
      [params.albumId]: data.album,
    };
  } catch (error) {
    /**
     * Adds fake album to the state because we don't differentiate
     * between error and empty.
     */
    dashboard.curatedAlbumsById = {
      ..._curatedAlbumsById,
      [params.albumId]: { id: params.albumId, title: '', sandboxes: [] },
    };

    effects.notificationToast.error(
      'There was a problem getting the requested collection'
    );
  }
};

export const addSandboxesToAlbum = async (
  { actions, effects }: Context,
  { albumId, sandboxIds }: { albumId: string; sandboxIds: string[] }
) => {
  try {
    await effects.gql.mutations.addSandboxesToAlbum({
      albumId,
      sandboxIds,
    });
    actions.dashboard.getCuratedAlbums();
  } catch (error) {
    effects.notificationToast.error('There was a problem updating albums');
  }
};

export const removeSandboxesFromAlbum = async (
  { actions, effects }: Context,
  { albumId, sandboxIds }: { albumId: string; sandboxIds: string[] }
) => {
  try {
    await effects.gql.mutations.removeSandboxesFromAlbum({
      albumId,
      sandboxIds,
    });
    actions.dashboard.getCuratedAlbums();
  } catch (error) {
    effects.notificationToast.error('There was a problem updating albums');
  }
};

export const createAlbum = async (
  { state, effects }: Context,
  { title }: { title: string }
) => {
  try {
    const data = await effects.gql.mutations.createAlbum({ title });
    state.dashboard.curatedAlbums.push({
      id: data.createAlbum.id,
      title: data.createAlbum.title,
      sandboxes: [],
    });
  } catch (error) {
    effects.notificationToast.error('There was a problem updating album');
  }
};

export const updateAlbum = async (
  { state, effects }: Context,
  { id, title }: { id: string; title: string }
) => {
  try {
    await effects.gql.mutations.updateAlbum({ id, title });
    state.dashboard.curatedAlbums = state.dashboard.curatedAlbums.map(album => {
      if (album.id === id) album.title = title;
      return album;
    });
  } catch (error) {
    effects.notificationToast.error('There was a problem updating album');
  }
};

export const getContributionBranches = async ({ state, effects }: Context) => {
  const { dashboard } = state;
  try {
    dashboard.contributions = null;

    const contributionsData = await effects.gql.queries.getContributionBranches(
      {}
    );
    const contributionBranches = contributionsData?.me?.recentBranches;
    if (!contributionBranches) {
      return;
    }

    dashboard.contributions = contributionBranches;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your open source contributions'
    );
  }
};

type RepositoriesActionOptions = {
  teamId: string;
  fetchCachedDataFirst?: boolean;
};
export const getRepositoriesByTeam = async (
  { state, effects, actions }: Context,
  { teamId, fetchCachedDataFirst = false }: RepositoriesActionOptions
) => {
  const { dashboard } = state;

  try {
    // syncData: true tells backend to return the repositories from the cache,
    // avoiding the GitHub API for the request
    const response = await effects.gql.queries.getRepositoriesByTeam({
      teamId,
      syncData: !fetchCachedDataFirst,
    });
    const repositories = response?.me?.team?.projects;
    if (!repositories) {
      return;
    }

    const accessedRepositories = repositories.filter(r => r.lastAccessedAt);
    const unaccessedRepositories = repositories.filter(r => !r.lastAccessedAt);

    dashboard.repositoriesByTeamId = {
      ...dashboard.repositoriesByTeamId,
      [teamId]: [
        ...accessedRepositories.sort(sortByLastAccessed),
        ...unaccessedRepositories,
      ],
    };

    // If fetchCachedDataFirst was true, the initial call was made (faster), so we can
    // safely trigger the second call to sync with GitHub (slower)
    if (fetchCachedDataFirst) {
      actions.dashboard.getRepositoriesByTeam({
        teamId,
      });
    }
  } catch (error) {
    if (!fetchCachedDataFirst && error?.response?.status === 504) {
      // Fail silently for timeout requests (unlikely to happen anymore)
      return;
    }

    if (fetchCachedDataFirst) {
      effects.notificationToast.error(
        'There was a problem getting your repositories'
      );
    } else {
      effects.notificationToast.error(
        'There was a problem syncing your repositories with GitHub, data shown might not be up to date'
      );
    }
  }
};

// Fetch the repository with all its branches
// Cached by `team/owner/name` key
export const getRepositoryWithBranches = async (
  { state, effects }: Context,
  {
    activeTeam,
    owner,
    name,
  }: { activeTeam: string; owner: string; name: string }
) => {
  const { dashboard } = state;

  const repoKey = getProjectUniqueKey({ teamId: activeTeam, owner, name });

  try {
    const repositoryData = await effects.gql.queries.getRepositoryByDetails({
      owner,
      name,
      teamId: activeTeam,
    });
    const repository = repositoryData?.project;
    if (!repository) {
      return;
    }

    dashboard.repositoriesWithBranches = {
      ...dashboard.repositoriesWithBranches,
      [repoKey]: repository,
    };
  } catch (error) {
    effects.notificationToast.error(
      `There was a problem getting repository ${name} from ${owner}`
    );
  }
};

export const getStarredRepos = ({ state, effects }: Context) => {
  const { dashboard, activeTeam } = state;

  const persistedStarredRepos = effects.browser.storage.get(
    `CSB/EXPERIMENTAL_STARRED/${activeTeam}`
  ) as Array<{ owner: string; name: string }>;

  dashboard.starredRepos = persistedStarredRepos ?? [];
};

export const starRepo = (
  { state, effects }: Context,
  { owner, name }: { owner: string; name: string }
) => {
  const { dashboard, activeTeam } = state;

  const existingRepo = dashboard.starredRepos.find(
    repo => repo.owner === owner && repo.name === name
  );
  if (existingRepo) {
    return;
  }

  dashboard.starredRepos.push({ owner, name });
  effects.browser.storage.set(
    `CSB/EXPERIMENTAL_STARRED/${activeTeam}`,
    dashboard.starredRepos
  );
};

export const unstarRepo = (
  { state, effects }: Context,
  { owner, name }: { owner: string; name: string }
) => {
  const { dashboard, activeTeam } = state;

  dashboard.starredRepos = dashboard.starredRepos.filter(
    repo => repo.owner !== owner || repo.name !== name
  );
  effects.browser.storage.set(
    `CSB/EXPERIMENTAL_STARRED/${activeTeam}`,
    dashboard.starredRepos
  );
};

type BranchToRemove = {
  owner: string;
  repoName: string;
  name: string;
  id: string;
  page: PageTypes;
};
export const removeBranchFromRepository = async (
  { actions, effects, state }: Context,
  branch: BranchToRemove
) => {
  const { activeTeam, dashboard } = state;
  if (!activeTeam) {
    return;
  }
  const { id, owner, repoName, name, page } = branch;

  dashboard.removingBranch = { id };

  try {
    await effects.gql.mutations.deleteBranch({ branchId: id });

    // Clean the branch references from all possible locations in the state
    // 1. Repository with branches
    // 2. Contribution branches
    // 3. Recent branches
    const key = getProjectUniqueKey({
      teamId: activeTeam,
      owner,
      name: repoName,
    });
    const repository = dashboard.repositoriesWithBranches[key];

    if (repository) {
      dashboard.repositoriesWithBranches = {
        ...dashboard.repositoriesWithBranches,
        [key]: {
          ...repository,
          branches: repository.branches.filter(b => b.id !== id),
        },
      };
    }

    dashboard.contributions =
      dashboard.contributions?.filter(b => b.id !== id) ?? [];

    dashboard.sandboxes.RECENT_BRANCHES =
      dashboard.sandboxes.RECENT_BRANCHES?.filter(b => b.id !== id) ?? [];

    if (page === 'recent') {
      // Trigger re-fetching of recent page data to fill in the free spot
      actions.dashboard.getStartPageSandboxes();
    }
  } catch (error) {
    effects.notificationToast.error(
      `Failed to remove branch ${name} from ${owner}/${repoName}`
    );
  } finally {
    dashboard.removingBranch = null;
  }
};

type RemoveRepositoryParams = {
  project: ProjectFragment;
  page: PageTypes;
};
export const removeRepositoryFromTeam = async (
  { actions, state, effects }: Context,
  { project, page }: RemoveRepositoryParams
) => {
  const { activeTeam, dashboard, sidebar } = state;
  if (!activeTeam) {
    return;
  }

  const { team: assignedTeam } = project;
  const { owner, name } = project.repository;

  dashboard.removingRepository = { owner, name };

  try {
    if (assignedTeam?.id) {
      const confirmed = await actions.modals.alertModal.open({
        title: 'Remove repository',
        type: 'danger',
        message:
          'This action will remove the repository and all the branches from CodeSandbox. Any code that is not pushed on GitHub will be lost.',
      });

      if (!confirmed) {
        return;
      }

      effects.analytics.track('Dashboard - Remove Assigned Repository');

      await effects.gql.mutations.deleteProject({
        owner,
        name,
        teamId: activeTeam,
      });
    } else {
      await effects.api.removeLinkedProjectFromTeam(owner, name, activeTeam);
    }

    // Remove all cached data about repository
    // 1. From repositories list
    // 2. From repository with branches cache
    // 3. Branches from recent page
    // 4. From sidebar list

    const teamRepositories = dashboard.repositoriesByTeamId[activeTeam];
    if (teamRepositories) {
      dashboard.repositoriesByTeamId = {
        ...dashboard.repositoriesByTeamId,
        [activeTeam]: teamRepositories.filter(
          r => r.repository.owner !== owner || r.repository.name !== name
        ),
      };
    }

    const key = getProjectUniqueKey({ teamId: activeTeam, owner, name });
    const repositoryWithBranches = dashboard.repositoriesWithBranches[key];
    if (repositoryWithBranches) {
      dashboard.repositoriesWithBranches = {
        ...dashboard.repositoriesWithBranches,
        [key]: undefined,
      };
    }

    dashboard.sandboxes.RECENT_BRANCHES =
      dashboard.sandboxes.RECENT_BRANCHES?.filter(b => {
        const branchRepo = b.project.repository;

        return branchRepo.owner === owner && branchRepo.name === name;
      }) ?? [];

    sidebar.repositories = sidebar.repositories.filter(
      r => r.owner !== owner || r.name !== name
    );

    // Refetch start page data in the background to fill the remaining slots
    if (page === 'recent') {
      actions.dashboard.getStartPageSandboxes();
    }

    // Redirect to main dashboard page when removing the repo from within the page
    if (page === 'repository-branches') {
      effects.router.redirectToDashboard();
    }
  } catch (error) {
    effects.notificationToast.error(
      `Failed to remove project ${owner}/${name}`
    );
  } finally {
    dashboard.removingRepository = null;
  }
};

export const importGitHubRepository = async (
  { state, effects }: Context,
  {
    owner,
    name,
    redirect = true,
  }: { owner: string; name: string; redirect?: boolean }
) => {
  const { activeTeam } = state;

  if (!activeTeam) {
    return undefined;
  }

  try {
    const result = await effects.gql.mutations.importProject({
      name,
      owner,
      teamId: activeTeam,
    });

    if (redirect) {
      window.location.href = v2BranchUrl({
        owner,
        repoName: name,
        branchName: result.importProject.defaultBranch.name,
        workspaceId: activeTeam,
        importFlag: true,
      });
    } else {
      return result;
    }
  } catch (error) {
    notificationState.addNotification({
      message: JSON.stringify(error),
      title: 'Failed to import repository',
      status: NotificationStatus.ERROR,
    });
  }

  return undefined;
};

export type ForkSource = {
  owner: string;
  name: string;
};
export type ForkDestination = {
  organization?: string;
  name: string;
  teamId: string;
};

export const forkGitHubRepository = async (
  { effects }: Context,
  params: {
    source: ForkSource;
    destination: ForkDestination;
  }
) => {
  try {
    const response = await effects.api.forkRepository(
      params.source,
      params.destination
    );
    window.location.href = v2BranchUrl({
      workspaceId: params.destination.teamId,
      importFlag: true,
      owner: response.owner,
      repoName: response.repo,
      branchName: response.branch,
    });
  } catch (error) {
    notificationState.addNotification({
      message: JSON.stringify(error),
      title: 'Failed to fork repository',
      status: NotificationStatus.ERROR,
    });
  }
};

export const createDraftBranch = async (
  { state, effects }: Context,
  {
    owner,
    name,
    teamId,
    openInNewTab = false,
  }: { owner: string; name: string; teamId: string; openInNewTab?: boolean }
) => {
  if (state.dashboard.creatingBranch) {
    return;
  }

  try {
    state.dashboard.creatingBranch = true;

    const response = await effects.gql.mutations.createBranch({
      name,
      owner,
      teamId,
    });

    const branchName = response.createBranch.name;
    const branchUrl = v2BranchUrl({
      workspaceId: teamId,
      owner,
      repoName: name,
      branchName,
    });

    if (openInNewTab) {
      window.open(branchUrl);
    } else {
      window.location.href = branchUrl;
    }
  } catch (error) {
    notificationState.addNotification({
      message: JSON.stringify(error),
      title: 'Failed to create branch',
      status: NotificationStatus.ERROR,
    });
  } finally {
    state.dashboard.creatingBranch = false;
  }
};

export const convertToDevbox = async (
  { effects, actions }: Context,
  sandboxId: string
) => {
  await effects.api.updateSandbox(sandboxId, { v2: true });

  // Update in-memory state
  actions.dashboard.internal.changeSandboxesInState({
    sandboxIds: [sandboxId],
    sandboxMutation: sandbox => ({
      ...sandbox,
      isV2: true,
      // Update only non-draft restricted sandboxes when they are converted to devboxes
      restricted: sandbox.draft ? sandbox.restricted : false,
    }),
  });

  // Re-fetch team to get updated usage data
  actions.getActiveTeamInfo();
};
