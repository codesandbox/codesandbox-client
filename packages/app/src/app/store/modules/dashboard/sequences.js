import { set } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';

import { withLoadApp } from '../../factories';
import * as actions from './actions';

export const loadDashboard = withLoadApp([
  actions.getUserSandboxes,
  set(state`dashboard.sandboxes`, props`sandboxes`),
]);

export const selectSandboxes = [
  set(state`dashboard.selectedSandboxes`, props`sandboxIds`),
];
