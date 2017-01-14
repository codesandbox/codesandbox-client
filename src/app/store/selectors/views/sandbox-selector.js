import { createSelector } from 'reselect';

export const sandboxViewSelector = state => state.views.sandbox;

export const tabsSelector = createSelector(
  sandboxViewSelector,
  view => view.tabs,
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
