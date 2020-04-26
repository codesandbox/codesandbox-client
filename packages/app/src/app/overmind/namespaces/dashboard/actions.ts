import { Action, AsyncAction } from 'app/overmind';
import { withLoadApp, TEAM_ID_LOCAL_STORAGE } from 'app/overmind/factories';
import downloadZip from 'app/overmind/effects/zip/create-zip';
import { uniq } from 'lodash-es';
import { Direction } from 'app/graphql/types';
import { OrderBy, sandboxesTypes } from './state';

// DELETE WHEN NEW DASHBOARD ONLINE
export const dashboardMounted: AsyncAction = async (context, value) => {
  await withLoadApp()(context, value);
};

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

export const setActiveTeam: Action<{
  id: string;
}> = ({ state, effects }, { id }) => {
  state.dashboard.activeTeam = id;
  effects.browser.storage.set(TEAM_ID_LOCAL_STORAGE, id);
};

export const dragChanged: Action<{ isDragging: boolean }> = (
  { state },
  { isDragging }
) => {
  state.dashboard.isDragging = isDragging;
};

export const orderByChanged: Action<OrderBy> = ({ state }, orderBy) => {
  state.dashboard.orderBy = orderBy;
};

export const blacklistedTemplateAdded: Action<string> = (
  { state },
  template
) => {
  state.dashboard.filters.blacklistedTemplates.push(template);
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
  state.dashboard.filters.blacklistedTemplates = [];
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

export const createSandboxClicked: AsyncAction<{
  body: { collectionId: string };
  sandboxId: string;
}> = ({ actions }, { body, sandboxId }) =>
  actions.editor.forkExternalSandbox({ body, sandboxId });

export const deleteTemplate: AsyncAction<{
  sandboxId: string;
  templateId: string;
}> = async ({ actions, effects }, { sandboxId, templateId }) => {
  try {
    effects.analytics.track('Template - Removed', { source: 'Context Menu' });
    await effects.api.deleteTemplate(sandboxId, templateId);
    actions.modalClosed();
    effects.notificationToast.success('Template Deleted');
  } catch (error) {
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
export const getRecentSandboxes: AsyncAction = withLoadApp(
  async ({ state, effects }) => {
    const { dashboard } = state;
    try {
      const data = await effects.gql.queries.recentSandboxes({
        limit: 50,
        orderField: dashboard.orderBy.field,
        orderDirection: dashboard.orderBy.order.toUpperCase() as Direction,
      });
      if (!data || !data.me) {
        return;
      }

      dashboard.sandboxes[sandboxesTypes.RECENT] = data.me.sandboxes;
    } catch (error) {
      effects.notificationToast.error(
        'There was a problem getting your recent Sandboxes'
      );
    }
  }
);

export const getAllFolders: AsyncAction = withLoadApp(
  async ({ state, effects }) => {
    try {
      const data = await effects.gql.queries.getCollections({
        teamId: state.dashboard.activeTeam,
      });
      if (!data || !data.me || !data.me.collections) {
        return;
      }

      // this is here because it will be done in the backend in the *FUTURE*
      const collectionsByLevel = data.me.collections.map(collection => {
        const split = collection.path.split('/');
        return {
          ...collection,
          parent: split.slice(0, split.length - 1).find(a => a) || '',
          level: split.length - 2,
          name: split[split.length - 1],
        };
      });

      state.dashboard.allCollections = [
        {
          id: 'drafts-fake-id',
          parent: '',
          name: 'Drafts',
          level: 0,
          path: '/drafts',
        },
        ...collectionsByLevel.filter(c => c.id),
      ];
    } catch {
      effects.notificationToast.error(
        'There was a problem getting your Sandboxes'
      );
    }
  }
);

export const getDrafts: AsyncAction = withLoadApp(
  async ({ state, effects }) => {
    const { dashboard } = state;
    try {
      const data = await effects.gql.queries.sandboxesByPath({
        path: '/',
        teamId: state.dashboard.activeTeam,
      });
      if (!data || !data.me || !data.me.collection) {
        return;
      }

      dashboard.sandboxes[
        sandboxesTypes.DRAFTS
      ] = data.me.collection.sandboxes.filter(s => !s.customTemplate);
    } catch (error) {
      effects.notificationToast.error(
        'There was a problem getting your Sandboxes'
      );
    }
  }
);

export const getSandboxesByPath: AsyncAction<string> = withLoadApp(
  async ({ state, effects }, path) => {
    const { dashboard } = state;
    try {
      const data = await effects.gql.queries.sandboxesByPath({
        path: '/' + path,
        teamId: state.dashboard.activeTeam,
      });
      if (!data || !data.me || !data.me.collection) {
        return;
      }

      dashboard.sandboxes[sandboxesTypes.ALL] = {};
      dashboard.sandboxes[sandboxesTypes.ALL][
        path.split(' ').join('')
      ] = data.me.collection.sandboxes.filter(s => !s.customTemplate);
    } catch (error) {
      effects.notificationToast.error(
        'There was a problem getting your Sandboxes'
      );
    }
  }
);

export const getDeletedSandboxes: AsyncAction = withLoadApp(
  async ({ state, effects }) => {
    const { dashboard } = state;
    try {
      const data = await effects.gql.queries.deletedSandboxes({});
      if (!data || !data.me) {
        return;
      }
      dashboard.sandboxes[sandboxesTypes.DELETED] = data.me.sandboxes;
    } catch (error) {
      effects.notificationToast.error(
        'There was a problem getting your deleted Sandboxes'
      );
    }
  }
);

export const getTemplateSandboxes: AsyncAction = withLoadApp(
  async ({ state, effects }) => {
    const { dashboard } = state;
    try {
      if (dashboard.activeTeam) {
        dashboard.sandboxes[sandboxesTypes.TEMPLATES] = null;
        const data = await effects.gql.queries.teamTemplates({
          id: dashboard.activeTeam,
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
  }
);

export const getStartPageSandboxes: AsyncAction = withLoadApp(
  async ({ state, effects }) => {
    const { dashboard } = state;
    try {
      const usedTemplates = await effects.gql.queries.listPersonalTemplates({});

      if (!usedTemplates || !usedTemplates.me) {
        return;
      }

      dashboard.sandboxes.TEMPLATE_START_PAGE = usedTemplates.me.recentlyUsedTemplates.slice(
        0,
        4
      );

      const recentSandboxes = await effects.gql.queries.recentSandboxes({
        limit: 7,
        orderField: dashboard.orderBy.field,
        orderDirection: dashboard.orderBy.order.toUpperCase() as Direction,
      });

      if (!recentSandboxes || !recentSandboxes.me) {
        return;
      }
      dashboard.sandboxes.RECENT_START_PAGE = recentSandboxes.me.sandboxes;
    } catch (error) {
      effects.notificationToast.error(
        'There was a problem getting your Sandboxes'
      );
    }
  }
);

export const deleteSandboxFromState: Action<string[]> = (
  { state: { dashboard } },
  ids
) => {
  ids.map(id => {
    const values = Object.keys(dashboard.sandboxes).map(type => {
      if (dashboard.sandboxes[type]) {
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
    sandboxes.TEMPLATE_START_PAGE = sandboxes.TEMPLATE_START_PAGE
      ? sandboxes.TEMPLATES.filter(({ sandbox }) => sandbox.id !== id)
      : null;
    sandboxes.TEMPLATES = sandboxes.TEMPLATES
      ? sandboxes.TEMPLATES.filter(({ sandbox }) => sandbox.id !== id)
      : null;

    return null;
  });
};

export const deleteSandbox: AsyncAction<string[]> = async (
  { state, effects, actions },
  ids
) => {
  const { user } = state;
  if (!user) return;
  try {
    await effects.gql.mutations.deleteSandboxes({
      sandboxIds: ids,
    });
    actions.dashboard.deleteSandboxFromState(ids);
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem deleting your Sandbox'
    );
  }
};

export const unmakeTemplate: AsyncAction<string[]> = async (
  { effects, actions },
  ids
) => {
  try {
    await effects.gql.mutations.unmakeSandboxesTemplate({
      sandboxIds: ids,
    });
    actions.dashboard.deleteTemplateFromState(ids);
  } catch (error) {
    effects.notificationToast.error(
      'There was a problem reverting your template'
    );
  }
};

export const renameSandboxInState: Action<{
  id: string;
  title: string;
}> = ({ state: { dashboard } }, { id, title }) => {
  const values = Object.keys(dashboard.sandboxes).map(type => {
    if (dashboard.sandboxes[type]) {
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

export const renameSandbox: AsyncAction<{ id: string; title: string }> = async (
  { effects, actions },
  { id, title }
) => {
  try {
    await effects.gql.mutations.renameSandbox({
      id,
      title,
    });
    actions.dashboard.renameSandboxInState({
      id,
      title,
    });
  } catch {
    effects.notificationToast.error('There was a problem renaming you sandbox');
  }
};

export const renameFolder: AsyncAction<{
  name: string;
  path: string;
  newPath: string;
}> = async ({ state: { dashboard }, effects }, { name, path, newPath }) => {
  try {
    await effects.gql.mutations.renameFolder({
      newPath,
      path,
    });

    dashboard.allCollections = dashboard.allCollections.map(folder => {
      if (folder.path === path) {
        return {
          ...folder,
          path: newPath,
          name,
        };
      }

      return folder;
    });
  } catch {
    effects.notificationToast.error('There was a problem renaming you folder');
  }
};

export const deleteFolder: AsyncAction<{
  path: string;
}> = async ({ state: { dashboard }, effects }, { path }) => {
  try {
    await effects.gql.mutations.deleteFolder({
      path,
      teamId: dashboard.activeTeam,
    });

    dashboard.allCollections = dashboard.allCollections.filter(
      folder => folder.path !== path
    );
  } catch {
    effects.notificationToast.error('There was a problem deleting you folder');
  }
};

export const makeTemplate: AsyncAction<string[]> = async (
  { effects, actions },
  ids
) => {
  try {
    await effects.gql.mutations.makeSandboxesTemplate({
      sandboxIds: ids,
    });
    actions.dashboard.deleteSandboxFromState(ids);
  } catch (error) {
    effects.notificationToast.error('There was a problem making your template');
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
