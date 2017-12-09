import { createSelector } from 'reselect';

export const viewSelector = createSelector(state => state.view, view => view);
export const devToolsOpenSelector = createSelector(
  viewSelector,
  view => view.devToolsOpen
);
export const workspaceHiddenSelector = createSelector(
  viewSelector,
  view => view.workspaceHidden
);
export const quickActionsOpenSelector = createSelector(
  viewSelector,
  view => view.quickActionsOpen
);
