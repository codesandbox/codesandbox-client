import { Action, AsyncAction } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';
import { OrderBy } from './state';

export const dashboardMounted = withLoadApp();

export const sandboxesSelected: Action<string[]> = ({ state }, sandboxIds) => {
  state.dashboard.selectedSandboxes = sandboxIds;
};

export const setTrashSandboxes: Action<string[]> = ({ state }, sandboxIds) => {
  state.dashboard.trashSandboxIds = sandboxIds;
};

export const dragChanged: Action<boolean> = ({ state }, isDragging) => {
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
  templateToRemove
) => {
  state.dashboard.filters.blacklistedTemplates = state.dashboard.filters.blacklistedTemplates.filter(
    template => template !== templateToRemove
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

export const searchChanged: Action<string> = ({ state }, search) => {
  state.dashboard.filters.search = search;
};

export const createSandboxClicked: AsyncAction<string> = ({ actions }, id) =>
  actions.internal.forkSandbox(id);
