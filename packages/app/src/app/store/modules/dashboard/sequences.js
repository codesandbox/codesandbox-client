import { set } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';

import { withLoadApp } from '../../factories';
import * as actions from './actions';

export const loadDashboard = withLoadApp([]);

export const selectSandboxes = [
  set(state`dashboard.selectedSandboxes`, props`sandboxIds`),
];

export const setDragging = [
  set(state`dashboard.isDragging`, props`isDragging`),
];
