import { Action, AsyncAction } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';
import { Direction } from 'app/graphql/types';
import { OrderBy } from './state';

const TEAM_ID_LOCAL_STORAGE = 'codesandbox-selected-team-id';

export const dashboardMounted: AsyncAction = async (context, value) => {
  await withLoadApp()(context, value);
  const {
    effects: { browser },
    state: { dashboard },
  } = context;
  const localStorageTeam = browser.storage.get(TEAM_ID_LOCAL_STORAGE);
  if (localStorageTeam) {
    dashboard.activeTeam = localStorageTeam;
  }
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
export const getRecentSandboxes: AsyncAction = async ({ state, effects }) => {
  const { dashboard, user } = state;
  dashboard.loadingPage = true;
  if (!user) return;
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
    dashboard.loadingPage = false;
  } catch (error) {
    dashboard.loadingPage = false;
    effects.notificationToast.error(
      'There was a problem getting your recent Sandboxes'
    );
  }
};

export const getDrafts: AsyncAction = async ({ state, effects }) => {
  const { dashboard, user } = state;
  dashboard.loadingPage = true;
  if (!user) return;
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
    dashboard.loadingPage = false;
  } catch (error) {
    dashboard.loadingPage = false;
    effects.notificationToast.error(
      'There was a problem getting your Sandboxes'
    );
  }
};

export const getDeletedSandboxes: AsyncAction = async ({ state, effects }) => {
  const { dashboard, user } = state;
  dashboard.loadingPage = true;
  if (!user) return;
  try {
    const data = await effects.gql.queries.deletedSandboxes({});
    if (!data || !data.me) {
      return;
    }

    dashboard.deletedSandboxes = data.me.sandboxes;
    dashboard.loadingPage = false;
  } catch (error) {
    dashboard.loadingPage = false;
    effects.notificationToast.error(
      'There was a problem getting your deleted Sandboxes'
    );
  }
};

export const getTemplateSandboxes: AsyncAction = async ({ state, effects }) => {
  const { dashboard, user } = state;
  dashboard.loadingPage = true;
  if (!user) return;
  try {
    const data = await effects.gql.queries.ownedTemplates({ showAll: false });
    if (!data || !data.me) {
      return;
    }

    const templates =
      state.dashboard.activeTeam && data.me.teams
        ? (
            data.me.teams.find(t => t.id === state.dashboard.activeTeam) || {
              templates: [],
            }
          ).templates
        : data.me.templates;

    dashboard.templateSandboxes = templates;
    dashboard.loadingPage = false;
  } catch (error) {
    dashboard.loadingPage = false;
    effects.notificationToast.error(
      'There was a problem getting your Templates'
    );
  }
};

export const getStartPageSandboxes: AsyncAction = async ({
  state,
  effects,
}) => {
  const { dashboard, user } = state;
  dashboard.loadingPage = true;
  if (!user) return;
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
    dashboard.loadingPage = false;
  } catch (error) {
    dashboard.loadingPage = false;
    effects.notificationToast.error(
      'There was a problem getting your Sandboxes'
    );
  }
};
