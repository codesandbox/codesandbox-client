import { set } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import { addNotification } from '../../factories';
import * as actions from './actions';

export const mountPopularSandboxes = [
  actions.mountPopularSandboxes,
  {
    success: [set(state`explore.popularSandboxes`, props`popularSandboxes`)],
    error: [
      addNotification(
        'There has been a problem getting the sandboxes',
        'error'
      ),
    ],
  },
];

export const pickSandbox = [
  actions.pickSandbox,
  {
    success: [set(state`picked-${props`sandbox.id`}`, true)],
    error: [
      addNotification(
        'There has been a problem getting the sandboxes',
        'error'
      ),
    ],
  },
];
