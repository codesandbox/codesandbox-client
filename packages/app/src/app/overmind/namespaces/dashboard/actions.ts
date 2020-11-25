import { compareDesc, parseISO } from 'date-fns';
import { Action, AsyncAction } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';
import downloadZip from 'app/overmind/effects/zip/create-zip';
import { uniq } from 'lodash-es';
import {
  Direction,
  TemplateFragmentDashboardFragment,
  SandboxFragmentDashboardFragment,
  RepoFragmentDashboardFragment,
  TeamMemberAuthorization,
} from 'app/graphql/types';
import { getDecoratedCollection } from './utils';
import { OrderBy, sandboxesTypes } from './types';
import * as internalActions from './internalActions';

export const internal = internalActions;

export const dashboardMounted: AsyncAction = withLoadApp();

export const sandboxesSelected: Action<{
  sandboxIds: string[];
}> = ({ state }, { sandboxIds }) => {
  state.dashboard.selectedSandboxes = sandboxIds;
};

export const setTrashSandboxes: Action<{
  sandboxIds: string[];
}> = ({ state }, { sandboxIds }) => {
  state.dashboard.trashSandboxIds = sandboxIds;
};

export const dragChanged: Action<{ isDragging: boolean }> = (
  { state },
  { isDragging }
) => {
  state.dashboard.isDragging = isDragging;
};

export const orderByReset: Action = ({ state }, orderBy) => {
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

export const orderByChanged: Action<OrderBy> = ({ state }, orderBy) => {
  state.dashboard.orderBy = orderBy;
};

export const blacklistedTemplateAdded: Action<string> = (
  { state },
  template
) => {
  state.dashboard.filters.blacklistedTemplates = state.dashboard.filters.blacklistedTemplates.concat(
    template
  );
};

export const blacklistedTemplateRemoved: Action<string> = (
  { state },
  template
) => {
  state.dashboard.filters.blacklistedTemplates = state.dashboard.filters.blacklistedTemplates.filter(
    currentTemplate => currentTemplate !== template
  );
};

export const blacklistedTemplatesCleared: Action = ({ state }) => {
  if (state.dashboard.filters.blacklistedTemplates.length) {
    state.dashboard.filters.blacklistedTemplates = [];
  }
};

export const blacklistedTemplatesChanged: Action<string[]> = (
  { state },
  templates
) => {
  state.dashboard.filters.blacklistedTemplates = templates;
};

export const searchChanged: Action<{ search: string }> = (
  { state },
  { search }
) => {
  state.dashboard.filters.search = search;
};

export const viewModeChanged: Action<{ mode: 'grid' | 'list' }> = (
  { state, effects },
  { mode }
) => {
  state.dashboard.viewMode = mode;
  effects.browser.storage.set('VIEW_MODE_DASHBOARD', mode);
};

export const createSandboxClicked: AsyncAction<{
  body: { collectionId: string };
  sandboxId: string;
}> = ({ actions }, { body, sandboxId }) =>
  actions.editor.forkExternalSandbox({ body, sandboxId });

export const deleteTemplate: AsyncAction<{
  sandboxId: string;
  templateId: string;
}> = async ({ actions, effects, state }, { sandboxId, templateId }) => {
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

export const getTeams: AsyncAction = async ({ state, effects }) => {
  if (!state.user) return;
  const teams = await effects.gql.queries.getTeams({});

  if (!teams || !teams.me) {
    return;
  }

  state.dashboard.teams = teams.me.workspaces;
  state.personalWorkspaceId = teams.me.personalWorkspaceId;
};

export const removeFromTeam: AsyncAction<string> = async (
  { state, effects },
  id
) => {
  if (!state.activeTeam || !state.activeTeamInfo) return;
  try {
    await effects.gql.mutations.removeFromTeam({
      teamId: state.activeTeam,
      userId: id,
    });

    state.activeTeamInfo = {
      ...state.activeTeamInfo,
      users: (state.activeTeamInfo.users || []).filter(user => user.id !== id),
    };
  } catch {
    effects.notificationToast.error(
      'There has been a problem removing them from your workspace'
    );
  }
};

export const leaveTeam: AsyncAction = async ({ state, effects, actions }) => {
  if (!state.activeTeam || !state.activeTeamInfo) return;
  try {
    effects.analytics.track('Team - Leave Team', {
      dashboardVersion: 2,
    });
    await effects.gql.mutations.leaveTeam({
      teamId: state.activeTeam,
    });

    actions.setActiveTeam({ id: state.personalWorkspaceId! });
    actions.dashboard.getTeams();

    effects.notificationToast.success(
      `You successfully left the ${state.activeTeamInfo.name} workspace`
    );
  } catch (e) {
    effects.notificationToast.error(
      'There has been a problem removing your from the workspace'
    );
  }
};

export const inviteToTeam: AsyncAction<string> = async (
  { state, effects },
  value
) => {
  if (!state.activeTeam) return;
  const isEmail = value.includes('@');
  try {
    effects.analytics.track('Team - Add Member', {
      dashboardVersion: 2,
      isEmail,
    });
    let data: any | null = null;
    if (isEmail) {
      const emailInvited = await effects.gql.mutations.inviteToTeamVieEmail({
        teamId: state.activeTeam,
        email: value,
      });

      data = emailInvited.inviteToTeamViaEmail;
    } else {
      const result = await effects.gql.mutations.inviteToTeam({
        teamId: state.activeTeam,
        username: value,
      });

      state.activeTeamInfo = result.inviteToTeam;
      data = result.inviteToTeam;
    }

    if (!data) {
      return;
    }

    effects.notificationToast.success(
      `Successfully invited ${value} to your workspace`
    );
  } catch (e) {
    const errorMessageExists =
      e.response && e.response.errors && e.response.errors.length;
    effects.notificationToast.error(
      errorMessageExists
        ? e.response.errors[0].message
        : `There was a problem inviting ${value} to your workspace`
    );
  }
};

export const getRecentSandboxes: AsyncAction = async ({ state, effects }) => {
  const { dashboard } = state;
  try {
    let sandboxes;

    if (state.activeTeam) {
      const data = await effects.gql.queries.recentTeamSandboxes({
        teamId: state.activeTeam,
        limit: 200,
        orderField: dashboard.orderBy.field,
        orderDirection: dashboard.orderBy.order.toUpperCase() as Direction,
      });

      if (!data.me?.team?.sandboxes) {
        return;
      }

      sandboxes = data.me.team.sandboxes;
    } else {
      const data = await effects.gql.queries.recentPersonalSandboxes({
        limit: 200,
        orderField: dashboard.orderBy.field,
        orderDirection: dashboard.orderBy.order.toUpperCase() as Direction,
      });

      if (!data?.me?.sandboxes) {
        return;
      }

      sandboxes = data.me.sandboxes;
    }

    dashboard.sandboxes[sandboxesTypes.RECENT] = sandboxes;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your recent Sandboxes'
    );
  }
};

export const getAllFolders: AsyncAction = async ({ state, effects }) => {
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

export const createFolder: AsyncAction<string> = async (
  { effects, state },
  path
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

export const getDrafts: AsyncAction = async ({ state, effects }) => {
  const { dashboard } = state;
  try {
    let sandboxes: SandboxFragmentDashboardFragment[];

    if (state.activeTeam) {
      const data = await effects.gql.queries.getTeamDrafts({
        teamId: state.activeTeam,
        authorId: null,
      });
      if (typeof data?.me?.team?.drafts === 'undefined') {
        return;
      }
      sandboxes = data.me.team.drafts;
    } else {
      const data = await effects.gql.queries.sandboxesByPath({
        path: '/',
        teamId: state.activeTeam,
      });
      if (typeof data?.me?.collection?.sandboxes === 'undefined') {
        return;
      }
      sandboxes = data.me.collection.sandboxes;
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

export const getSandboxesByPath: AsyncAction<string> = async (
  { state, effects },
  path
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

export const getReposByPath: AsyncAction<string> = async (
  { state, effects },
  path
  // eslint-disable-next-line consistent-return
) => {
  const { dashboard } = state;
  try {
    if (path && dashboard.sandboxes.REPOS) {
      return;
    }
    let sandboxes: RepoFragmentDashboardFragment[];
    if (state.activeTeam) {
      dashboard.sandboxes.REPOS = null;
      const teamData = await effects.gql.queries.getTeamRepos({
        id: state.activeTeam,
      });
      if (!teamData || !teamData.me || !teamData.me.team) {
        return;
      }
      sandboxes = teamData.me.team.sandboxes;
    } else {
      dashboard.sandboxes.REPOS = null;
      const myData = await effects.gql.queries.getPersonalRepos({});

      if (!myData || !myData.me) {
        return;
      }

      sandboxes = myData.me.sandboxes;
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

export const getDeletedSandboxes: AsyncAction = async ({ state, effects }) => {
  const { dashboard } = state;
  try {
    let sandboxes;

    if (state.activeTeam) {
      const data = await effects.gql.queries.deletedTeamSandboxes({
        teamId: state.activeTeam,
      });

      sandboxes = data?.me?.team?.sandboxes;
    } else {
      const data = await effects.gql.queries.deletedPersonalSandboxes({});

      sandboxes = data?.me?.sandboxes;
    }

    if (!sandboxes) {
      return;
    }

    dashboard.sandboxes[sandboxesTypes.DELETED] = sandboxes;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your deleted Sandboxes'
    );
  }
};

export const getTemplateSandboxes: AsyncAction = async ({ state, effects }) => {
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
    } else {
      dashboard.sandboxes[sandboxesTypes.TEMPLATES] = null;
      const data = await effects.gql.queries.ownedTemplates({
        showAll: false,
      });
      if (!data || !data.me) {
        return;
      }

      dashboard.sandboxes[sandboxesTypes.TEMPLATES] = data.me.templates;
    }
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your Templates'
    );
  }
};

export const getStartPageSandboxes: AsyncAction = async ({
  state,
  effects,
}) => {
  const { dashboard } = state;
  try {
    const usedTemplates = await effects.gql.queries.listPersonalTemplates({
      teamId: state.activeTeam,
    });

    if (!usedTemplates || !usedTemplates.me) {
      return;
    }

    dashboard.sandboxes.TEMPLATE_HOME = usedTemplates.me.recentlyUsedTemplates.slice(
      0,
      5
    );

    const result = await effects.gql.queries.recentlyAccessedSandboxes({
      limit: 12,
      teamId: state.activeTeam,
    });

    if (result?.me?.recentlyAccessedSandboxes == null) {
      return;
    }

    dashboard.sandboxes.RECENT_HOME = result.me.recentlyAccessedSandboxes;
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem getting your sandboxes'
    );
  }
};

export const deleteTemplateFromState: Action<string[]> = (
  { state: { dashboard } },
  ids
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

export const deleteSandbox: AsyncAction<{
  ids: string[];
}> = async ({ state, effects, actions }, { ids }) => {
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
  } catch (error) {
    state.dashboard.sandboxes = { ...oldSandboxes };

    effects.notificationToast.error(
      'There was a problem deleting your Sandbox'
    );
  }
};

export const unmakeTemplates: AsyncAction<{ templateIds: string[] }> = async (
  { effects, actions, state },
  { templateIds }
) => {
  const oldTemplates = {
    TEMPLATE_HOME: state.dashboard.sandboxes.TEMPLATE_HOME,
    TEMPLATES: state.dashboard.sandboxes.TEMPLATES,
  };
  actions.dashboard.deleteTemplateFromState(templateIds);
  try {
    await effects.gql.mutations.unmakeSandboxesTemplate({
      sandboxIds: templateIds,
    });
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

export const renameFolderInState: Action<{ path: string; newPath: string }> = (
  { state: { dashboard } },
  { path, newPath }
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

export const renameSandbox: AsyncAction<{
  id: string;
  title: string;
}> = async ({ effects, actions }, { id, title }) => {
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

export const moveFolder: AsyncAction<{
  path: string;
  newPath: string;
  newTeamId: string | null;
  teamId: string | null;
}> = async (
  { state: { dashboard }, actions, effects },
  { path, newPath, teamId, newTeamId }
) => {
  if (!dashboard.allCollections) return;

  effects.analytics.track('Dashboard - Move Folder', {
    dashboardVersion: 2,
  });
  actions.dashboard.renameFolder({ path, newPath, teamId, newTeamId });
};

export const renameFolder: AsyncAction<{
  path: string;
  newPath: string;
  newTeamId: string | null;
  teamId: string | null;
}> = async (
  { state: { dashboard }, effects, actions },
  { path, newPath, teamId, newTeamId }
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

export const deleteFolder: AsyncAction<{
  path: string;
}> = async ({ state: { dashboard, activeTeam }, effects }, { path }) => {
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

export const makeTemplates: AsyncAction<{
  sandboxIds: string[];
}> = async ({ effects, state, actions }, { sandboxIds: ids }) => {
  effects.analytics.track('Dashboard - Make Template', {
    dashboardVersion: 2,
  });

  const oldSandboxes = state.dashboard.sandboxes;
  actions.dashboard.internal.deleteSandboxesFromState({ ids });

  try {
    await effects.gql.mutations.makeSandboxesTemplate({
      sandboxIds: ids,
    });
  } catch (error) {
    state.dashboard.sandboxes = { ...oldSandboxes };
    effects.notificationToast.error('There was a problem making your template');
  }
};

export const permanentlyDeleteSandboxes: AsyncAction<string[]> = async (
  { effects, state },
  ids
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

export const recoverSandboxes: AsyncAction<string[]> = async (
  { effects, state },
  ids
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

export const downloadSandboxes: AsyncAction<string[]> = async (
  { effects },
  ids
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

export const getSearchSandboxes: AsyncAction = async ({ state, effects }) => {
  const { dashboard } = state;
  try {
    const activeTeam = state.activeTeam;

    let sandboxes: SandboxFragmentDashboardFragment[];
    if (activeTeam) {
      const data = await effects.gql.queries.searchTeamSandboxes({
        teamId: activeTeam,
      });
      if (data?.me?.team?.sandboxes == null) {
        return;
      }

      sandboxes = data.me.team.sandboxes;
    } else {
      // This will be gone once we move everyone (even personal spaces) to workspaces
      const data = await effects.gql.queries.searchPersonalSandboxes({});
      if (data?.me?.sandboxes == null) {
        return;
      }

      sandboxes = data.me.sandboxes;
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

export const getPage: AsyncAction<sandboxesTypes> = async (
  { actions: { dashboard } },
  page
) => {
  switch (page) {
    case sandboxesTypes.RECENT:
      dashboard.getRecentSandboxes();
      break;
    case sandboxesTypes.HOME:
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
      break;

    default:
      break;
  }
};

export const addSandboxesToFolder: AsyncAction<{
  sandboxIds: string[];
  collectionPath: string | null;
  teamId?: string | null;
  deleteFromCurrentPath?: boolean;
}> = async (
  { state, effects, actions },
  {
    sandboxIds,
    collectionPath,
    teamId = state.activeTeam,
    deleteFromCurrentPath = true,
  }
) => {
  effects.analytics.track('Dashboard - Moved Sandboxes', {
    dashboardVersion: 2,
  });

  const oldSandboxes = state.dashboard.sandboxes;
  if (deleteFromCurrentPath) {
    actions.dashboard.internal.deleteSandboxesFromState({ ids: sandboxIds });
  }

  const existingCollection = state.dashboard?.allCollections?.find(
    f => f.path === collectionPath
  );
  if (existingCollection) {
    existingCollection.sandboxCount += sandboxIds.length;
  }

  try {
    await effects.gql.mutations.addSandboxToFolder({
      sandboxIds,
      collectionPath,
      teamId,
    });

    if (collectionPath) {
      // Prefetch that folder
      actions.dashboard.getSandboxesByPath(collectionPath.replace(/^\//, ''));
    } else {
      actions.dashboard.getPage(sandboxesTypes.DRAFTS);
    }
  } catch (e) {
    state.dashboard.sandboxes = { ...oldSandboxes };
    effects.notificationToast.error('There was a problem moving your sandbox');
  }
};

export const createTeam: AsyncAction<{
  teamName: string;
  pilot?: boolean;
}> = async ({ effects, actions, state }, { teamName, pilot = false }) => {
  try {
    effects.analytics.track('Team - Create Team', { dashboardVersion: 2 });
    const { createTeam: newTeam } = await effects.gql.mutations.createTeam({
      name: teamName,
      pilot,
    });
    state.dashboard.teams = [...state.dashboard.teams, newTeam];
    actions.setActiveTeam({ id: newTeam.id });
  } catch {
    effects.notificationToast.error('There was a problem creating your team');
  }
};

export const revokeTeamInvitation: AsyncAction<{
  teamId: string;
  userId: string;
}> = async ({ effects, state }, { teamId, userId }) => {
  const oldInvitees = state.activeTeamInfo!.invitees;
  const user = state.activeTeamInfo!.invitees.find(f => f.id === userId);
  state.activeTeamInfo!.invitees = state.activeTeamInfo!.invitees.filter(
    f => f.id !== userId
  );

  try {
    const result = await effects.gql.mutations.revokeTeamInvitation({
      userId,
      teamId,
    });

    state.activeTeamInfo = result.revokeTeamInvitation;

    let successMessage = 'Successfully revoked invitation';
    if (user) {
      successMessage += ` to ${user.username}`;
    }
    effects.notificationToast.success(successMessage);
  } catch (e) {
    state.activeTeamInfo!.invitees = oldInvitees;
  }
};

export const setTeamInfo: AsyncAction<{
  name: string;
  description: string | null;
  file: { name: string; url: string } | null;
}> = async ({ effects, state, actions }, { name, description, file }) => {
  if (!state.activeTeam) return;

  effects.analytics.track('Team - Update Info', {
    dashboardVersion: 2,
  });

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

    if (description) {
      await effects.gql.mutations.setTeamDescription({
        description,
        // only way to pass, null is a value in the BE
        // @ts-ignore
        teamId: state.activeTeam,
      });
    }

    if (file) {
      await actions.dashboard.updateTeamAvatar({
        ...file,
        teamId: state.activeTeam,
      });
    }
    state.dashboard.teams = state.dashboard.teams.map(team => {
      if (oldTeamInfo && team.id === oldTeamInfo.id) {
        return {
          ...team,
          name,
          description,
          avatarUrl: file ? file.url : team.avatarUrl,
        };
      }

      return team;
    });

    if (oldActiveTeamInfo) {
      state.activeTeamInfo = {
        ...oldActiveTeamInfo,
        name,
        description,
        avatarUrl: file ? file.url : oldActiveTeamInfo.avatarUrl,
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

export const changeSandboxesFrozen: AsyncAction<{
  sandboxIds: string[];
  isFrozen: boolean;
}> = async ({ actions, effects }, { sandboxIds, isFrozen }) => {
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
      message: "We weren't able to update the frozen status of the sandboxes",
      error,
    });
  }
};

export const changeSandboxesPrivacy: AsyncAction<{
  sandboxIds: string[];
  privacy: 0 | 1 | 2;
}> = async ({ actions, effects }, { sandboxIds, privacy }) => {
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

export const updateTeamAvatar: AsyncAction<{
  name: string;
  url: string;
  teamId: string;
}> = async ({ actions, effects, state }, { name, url, teamId }) => {
  if (!state.activeTeamInfo) return;
  const oldAvatar = state.activeTeamInfo.avatarUrl;
  state.activeTeamInfo.avatarUrl = url;

  effects.analytics.track('Team - Update Team Avatar', { dashboardVersion: 2 });

  try {
    await effects.api.updateTeamAvatar(name, url, teamId);
  } catch (error) {
    state.activeTeamInfo.avatarUrl = oldAvatar;

    actions.internal.handleError({
      message: "We weren't able to update your team avatar",
      error,
    });
  }
};

export const changeAuthorizationInState: Action<{
  userId: string;
  authorization: TeamMemberAuthorization;
}> = ({ state }, { userId, authorization }) => {
  const userAuthorizations = state.activeTeamInfo!.userAuthorizations.map(
    user => {
      if (user.userId === userId) return { ...user, authorization };
      return user;
    }
  );

  state.activeTeamInfo!.userAuthorizations = userAuthorizations;
};

export const changeAuthorization: AsyncAction<{
  userId: string;
  authorization: TeamMemberAuthorization;
}> = async ({ state, effects, actions }, { userId, authorization }) => {
  // optimistic update
  const oldAuthorization = state.activeTeamInfo!.userAuthorizations.find(
    user => user.userId === userId
  )!.authorization;

  actions.dashboard.changeAuthorizationInState({ userId, authorization });

  try {
    await effects.gql.mutations.changeTeamMemberAuthorization({
      teamId: state.activeTeam!,
      userId,
      authorization,
    });
    actions.getActiveTeamInfo();
  } catch (e) {
    let message = 'There has been a problem changing user authorization.';
    if (e?.response?.errors) {
      message += ' ' + e.response.errors.map(error => error.message).join(', ');
    }

    effects.notificationToast.error(message);

    // undo optimistic update
    actions.dashboard.changeAuthorizationInState({
      userId,
      authorization: oldAuthorization,
    });
  }
};

export const deleteWorkspace: AsyncAction = async ({
  actions,
  effects,
  state,
}) => {
  if (!state.activeTeamInfo) return;

  try {
    await effects.gql.mutations.deleteWorkspace({ teamId: state.activeTeam });

    actions.modalClosed();
    actions.setActiveTeam({ id: state.personalWorkspaceId! });
    effects.router.redirectToDashboard();
    actions.dashboard.getTeams();

    effects.notificationToast.success(`Your workspace was deleted`);
  } catch (error) {
    actions.internal.handleError({
      message: 'There was a problem deleting your workspace',
      error,
    });
  }
};

export const setTeamMinimumPrivacy: AsyncAction<{
  teamId: string;
  minimumPrivacy: SandboxFragmentDashboardFragment['privacy'];
  updateDrafts?: boolean;
  source: string;
}> = async (
  { state, effects },
  { teamId, minimumPrivacy, updateDrafts = false, source }
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

    const selectedTeam = state.dashboard.teams.find(
      team => team.id === state.personalWorkspaceId
    );

    if (selectedTeam) {
      selectedTeam.settings.minimumPrivacy = minimumPrivacy;
    }
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem updating your settings'
    );
  }
};
