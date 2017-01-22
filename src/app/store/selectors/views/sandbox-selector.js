import { createSelector } from 'reselect';

export const currentSandboxIdSelector = state => state.views.sandbox.currentSandboxId;

export const sandboxViewSelector = state => (
  state.views.sandbox[state.views.sandbox.currentSandboxId] || { tabs: [], currentTab: null }
);

export const tabsSelector = createSelector(
  sandboxViewSelector,
  view => view.tabs || [],
);

export const currentTabIdSelector = createSelector(
  sandboxViewSelector,
  view => view.currentTab,
);

export const currentTabSelector = createSelector(
  tabsSelector,
  currentTabIdSelector,
  (tabs, currentTabId) => tabs.find(t => t.id === currentTabId),
);
