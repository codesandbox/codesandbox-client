import { Action, AsyncAction } from 'app/overmind';
import { withLoadApp, TEAM_ID_LOCAL_STORAGE } from 'app/overmind/factories';
import { Direction } from 'app/graphql/types';
import { OrderBy } from './state';

// DELETE WHEN NEW DAHSBOARD ONLINE
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

      dashboard.recentSandboxes = data.me.sandboxes;
    } catch (error) {
      effects.notificationToast.error(
        'There was a problem getting your recent Sandboxes'
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

      dashboard.draftSandboxes = data.me.collection.sandboxes.filter(
        s => !s.customTemplate
      );
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

      dashboard.deletedSandboxes = data.me.sandboxes;
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
        dashboard.templateSandboxes = null;
        const data = await effects.gql.queries.teamTemplates({
          id: dashboard.activeTeam,
        });

        if (!data || !data.me || !data.me.team) {
          return;
        }

        dashboard.templateSandboxes = data.me.team.templates;
      } else {
        dashboard.templateSandboxes = null;
        const data = await effects.gql.queries.ownedTemplates({
          showAll: false,
        });
        if (!data || !data.me) {
          return;
        }

        dashboard.templateSandboxes = data.me.templates;
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
      const recentSandboxes = await effects.gql.queries.recentSandboxes({
        limit: 7,
        orderField: dashboard.orderBy.field,
        orderDirection: dashboard.orderBy.order.toUpperCase() as Direction,
      });

      const usedTemplates = await effects.gql.queries.listPersonalTemplates({});

      if (
        !usedTemplates ||
        !usedTemplates.me ||
        !recentSandboxes ||
        !recentSandboxes.me
      ) {
        return;
      }
      const recent = recentSandboxes.me.sandboxes;
      const templates = usedTemplates.me.recentlyUsedTemplates.slice(0, 4);

      dashboard.startPageSandboxes = {
        recent,
        templates,
      };
    } catch (error) {
      effects.notificationToast.error(
        'There was a problem getting your Sandboxes'
      );
    }
  }
);

export const deleteSandboxFromState: Action<string[]> = (
  { state: { dashboard }, effects },
  ids
) => {
  // eslint-disable-next-line array-callback-return
  ids.map(id => {
    dashboard.startPageSandboxes = {
      recent: dashboard.startPageSandboxes.recent.filter(
        sandbox => sandbox.id !== id
      ),
      templates: dashboard.startPageSandboxes.templates,
    };
    dashboard.draftSandboxes = dashboard.draftSandboxes.filter(
      sandbox => sandbox.id !== id
    );
    dashboard.recentSandboxes = dashboard.recentSandboxes.filter(
      sandbox => sandbox.id !== id
    );
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
