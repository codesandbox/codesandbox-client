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
} from 'app/graphql/types';
import { getDecoratedCollection } from './utils';
import { PageTypes, OrderBy, sandboxesTypes } from './types';

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

  state.dashboard.teams = teams.me.teams;
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
      'There has been a problem removing them from your team'
    );
  }
};

export const leaveTeam: AsyncAction = async ({ state, effects, actions }) => {
  if (!state.activeTeam || !state.activeTeamInfo) return;
  try {
    await effects.gql.mutations.leaveTeam({
      teamId: state.activeTeam,
    });

    actions.setActiveTeam({ id: null });
    actions.dashboard.getTeams();

    effects.notificationToast.success(
      `You successfully left the ${state.activeTeamInfo.name} team`
    );
  } catch (e) {
    effects.notificationToast.error(
      'There has been a problem removing your from the team'
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
      `Successfully invited ${value} to your team`
    );
  } catch (e) {
    const errorMessageExists =
      e.response && e.response.errors && e.response.errors.length;
    effects.notificationToast.error(
      errorMessageExists
        ? e.response.errors[0].message
        : `There was a problem inviting ${value} to your team`
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

    state.dashboard.allCollections = collectionsByLevel.filter(
      c => c.id && c.name
    );
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

    const repos = sandboxes
      .filter(s => s.originalGit && s.originalGit.repo !== 'static-template')
      .reduce((acc, curr) => {
        if (!curr.originalGit || !curr.originalGit.repo) return acc;
        if (acc[curr.originalGit.repo]) {
          const newSandboxes = acc[curr.originalGit.repo].sandboxes.concat(
            curr
          );
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

export const deleteSandboxFromState: Action<{
  ids: string[];
  page?: string;
  repoName?: string;
}> = ({ state: { dashboard } }, { ids, page, repoName }) => {
  if (page === 'repos' || dashboard.sandboxes.REPOS !== null) {
    if (
      !dashboard.sandboxes.REPOS ||
      !repoName ||
      !dashboard.sandboxes.REPOS[repoName || '']
    ) {
      return;
    }

    dashboard.sandboxes.REPOS = {
      ...dashboard.sandboxes.REPOS,
      [repoName]: {
        ...dashboard.sandboxes.REPOS[repoName],
        sandboxes: dashboard.sandboxes.REPOS[repoName].sandboxes.filter(
          s => s.id !== ids[0]
        ),
      },
    };
    return;
  }
  ids.map(id => {
    const values = Object.keys(dashboard.sandboxes).map(type => {
      if (dashboard.sandboxes[type]) {
        if (!Array.isArray(dashboard.sandboxes[type])) {
          const folderNames = dashboard.sandboxes[type];
          const sandboxes = Object.keys(folderNames).map(folderName => ({
            [folderName]: folderNames[folderName].filter(
              sandbox => sandbox.id !== id
            ),
          }));
          return {
            ...dashboard.sandboxes[type],
            ...sandboxes.reduce(
              (obj, item) =>
                Object.assign(obj, {
                  [Object.keys(item)[0]]: item[Object.keys(item)[0]],
                }),
              {}
            ),
          };
        }
        return dashboard.sandboxes[type].filter(sandbox => sandbox.id !== id);
      }
      return null;
    });

    dashboard.sandboxes = values.reduce(
      (initial, current, i) =>
        Object.assign(initial, {
          [Object.keys(dashboard.sandboxes)[i]]: current,
        }),
      {}
    );
    return null;
  });
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
  page: PageTypes;
  repoName?: string;
}> = async ({ state, effects, actions }, { ids, page, repoName }) => {
  const { user } = state;
  if (!user) return;
  const oldSandboxes = state.dashboard.sandboxes;
  actions.dashboard.deleteSandboxFromState({ ids, page, repoName });

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

export const renameSandboxInState: Action<{
  id: string;
  title: string;
  page: PageTypes;
  repoName: string | null;
}> = ({ state: { dashboard } }, { id, title, page, repoName }) => {
  if (page === 'repos' && repoName) {
    if (!dashboard.sandboxes.REPOS || !dashboard.sandboxes.REPOS[repoName]) {
      return;
    }

    const repoSandboxes = dashboard.sandboxes.REPOS[repoName];
    dashboard.sandboxes.REPOS = {
      ...dashboard.sandboxes.REPOS,
      [repoName]: {
        ...repoSandboxes,
        sandboxes: repoSandboxes?.sandboxes.map(sandbox => {
          if (sandbox.id === id) {
            return {
              ...sandbox,
              title,
            };
          }

          return sandbox;
        }),
      },
    };

    return;
  }
  const values = Object.keys(dashboard.sandboxes).map(type => {
    if (dashboard.sandboxes[type]) {
      if (Array.isArray(dashboard.sandboxes[type])) {
        return dashboard.sandboxes[type].map(sandbox => {
          if (sandbox.id === id) {
            return {
              ...sandbox,
              title,
            };
          }

          return sandbox;
        });
      }

      const folderNames = dashboard.sandboxes[type];
      const sandboxes = Object.keys(folderNames).map(folderName => ({
        [folderName]: folderNames[folderName].map(sandbox => {
          if (sandbox.id === id) {
            return {
              ...sandbox,
              title,
            };
          }

          return sandbox;
        }),
      }));

      return {
        ...dashboard.sandboxes[type],
        ...sandboxes.reduce(
          (obj, item) =>
            Object.assign(obj, {
              [Object.keys(item)[0]]: item[Object.keys(item)[0]],
            }),
          {}
        ),
      };
    }

    return null;
  });

  dashboard.sandboxes = values.reduce(
    (initial, current, i) =>
      Object.assign(initial, {
        [Object.keys(dashboard.sandboxes)[i]]: current,
      }),
    {}
  );
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
  oldTitle: string;
  page: PageTypes;
  repoName: string | null;
}> = async ({ effects, actions }, { id, title, oldTitle, page, repoName }) => {
  actions.dashboard.renameSandboxInState({
    id,
    title,
    page,
    repoName,
  });

  try {
    await effects.gql.mutations.renameSandbox({
      id,
      title,
    });
  } catch {
    actions.dashboard.renameSandboxInState({
      id,
      title: oldTitle,
      page,
      repoName,
    });

    effects.notificationToast.error('There was a problem renaming you sandbox');
  }
};

export const moveFolder: AsyncAction<{
  path: string;
  newPath: string;
  newTeamId: string | null;
  teamId: string | null;
}> = async (
  { state: { dashboard }, actions },
  { path, newPath, teamId, newTeamId }
) => {
  if (!dashboard.allCollections) return;
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
  page: PageTypes;
  repoName?: string;
}> = async (
  { effects, state, actions },
  { sandboxIds: ids, page, repoName }
) => {
  const oldSandboxes = state.dashboard.sandboxes;
  actions.dashboard.deleteSandboxFromState({ ids, page, repoName });

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
  deleteFromCurrentPath?: boolean;
}> = async (
  { state, effects, actions },
  { sandboxIds, collectionPath, deleteFromCurrentPath = true }
) => {
  const oldSandboxes = state.dashboard.sandboxes;
  if (deleteFromCurrentPath) {
    actions.dashboard.deleteSandboxFromState({ ids: sandboxIds });
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
      // only way to pass, null is a value in the BE
      // @ts-ignore
      teamId: state.activeTeam || undefined,
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
}> = async ({ effects, state }, { name, description }) => {
  const oldTeamInfo = state.dashboard.teams.find(team => team.name === name);
  const oldActiveTeamInfo = state.activeTeamInfo;
  try {
    await effects.gql.mutations.setTeamName({
      name,
      // only way to pass, null is a value in the BE
      // @ts-ignore
      teamId: state.activeTeam || undefined,
    });

    if (description) {
      await effects.gql.mutations.setTeamDescription({
        description,
        // only way to pass, null is a value in the BE
        // @ts-ignore
        teamId: state.activeTeam || undefined,
      });
    }
    state.dashboard.teams = state.dashboard.teams.map(team => {
      if (team.name === name) {
        return {
          ...team,
          name,
          description,
        };
      }

      return team;
    });

    if (oldActiveTeamInfo) {
      state.activeTeamInfo = {
        ...oldActiveTeamInfo,
        name,
        description,
      };
    }
  } catch (e) {
    if (oldActiveTeamInfo) {
      state.activeTeamInfo = { ...oldActiveTeamInfo };
    }
    if (state.dashboard.teams && oldTeamInfo) {
      state.dashboard.teams = [...state.dashboard.teams, oldTeamInfo];
    }
    effects.notificationToast.error('There was a problem renaming your team');
  }
};

export const changeSandboxPrivacy: AsyncAction<{
  id: string;
  privacy: 0 | 1 | 2;
  oldPrivacy: 0 | 1 | 2;
  page: PageTypes;
  repoName: string | null;
}> = async (
  { actions, effects },
  { id, privacy, oldPrivacy, page, repoName }
) => {
  // optimistic update

  actions.dashboard.changeSandboxPrivacyInState({
    id,
    privacy,
    page,
    repoName,
  });

  try {
    await effects.api.updatePrivacy(id, privacy);
  } catch (error) {
    // rollback optimistic

    actions.dashboard.changeSandboxPrivacyInState({
      id,
      privacy: oldPrivacy,
      page,
      repoName,
    });

    actions.internal.handleError({
      message: "We weren't able to update the sandbox privacy",
      error,
    });
  }
};

export const changeSandboxPrivacyInState: Action<{
  id: string;
  privacy: 0 | 1 | 2;
  page?: string;
  repoName: string | null;
}> = ({ state: { dashboard } }, { id, privacy, page, repoName }) => {
  if (page === 'repos' && repoName) {
    if (!dashboard.sandboxes.REPOS || !dashboard.sandboxes.REPOS[repoName]) {
      return;
    }

    const repoSandboxes = dashboard.sandboxes.REPOS[repoName];
    dashboard.sandboxes.REPOS = {
      ...dashboard.sandboxes.REPOS,
      [repoName]: {
        ...repoSandboxes,
        sandboxes: repoSandboxes?.sandboxes.map(sandbox => {
          if (sandbox.id === id) {
            return {
              ...sandbox,
              privacy,
            };
          }

          return sandbox;
        }),
      },
    };
    return;
  }

  const values = Object.keys(dashboard.sandboxes).map(type => {
    if (dashboard.sandboxes[type]) {
      if (Array.isArray(dashboard.sandboxes[type])) {
        return dashboard.sandboxes[type].map(sandbox => {
          if (sandbox.id === id) {
            return {
              ...sandbox,
              privacy,
            };
          }

          return sandbox;
        });
      }

      const folderNames = dashboard.sandboxes[type];
      const sandboxes = Object.keys(folderNames).map(folderName => ({
        [folderName]: folderNames[folderName].map(sandbox => {
          if (sandbox.id === id) {
            return {
              ...sandbox,
              privacy,
            };
          }

          return sandbox;
        }),
      }));

      return {
        ...dashboard.sandboxes[type],
        ...sandboxes.reduce(
          (obj, item) =>
            Object.assign(obj, {
              [Object.keys(item)[0]]: item[Object.keys(item)[0]],
            }),
          {}
        ),
      };
    }

    return null;
  });

  dashboard.sandboxes = values.reduce(
    (initial, current, i) =>
      Object.assign(initial, {
        [Object.keys(dashboard.sandboxes)[i]]: current,
      }),
    {}
  );
};
