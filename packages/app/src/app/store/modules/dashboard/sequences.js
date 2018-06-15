import { set, push } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';

import { withLoadApp } from '../../factories';
import * as actions from './actions';

import { forkSandbox } from '../../sequences';

export const loadDashboard = withLoadApp([]);

export const selectSandboxes = [
  set(state`dashboard.selectedSandboxes`, props`sandboxIds`),
];

export const setDragging = [
  set(state`dashboard.isDragging`, props`isDragging`),
];

export const setOrderBy = [set(state`dashboard.orderBy`, props`orderBy`)];

export const addBlacklistedTemplate = [
  push(state`dashboard.filters.blacklistedTemplates`, props`template`),
];

export const clearBlacklistedTemplates = [
  set(state`dashboard.filters.blacklistedTemplates`, []),
];

export const setBlacklistedTemplates = [
  set(state`dashboard.filters.blacklistedTemplates`, props`templates`),
];

export const removeBlacklistedTemplate = [actions.removeBlacklistedTemplate];

export const changeSearch = [
  set(state`dashboard.filters.search`, props`search`),
];

export const createSandbox = [forkSandbox];
