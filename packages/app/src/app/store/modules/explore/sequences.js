import { set } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import { addNotification } from '../../factories';
import * as actions from './actions';

export const pickedSandboxes = [
  set(state`explore.pickedSandboxesLoading`, true),
  actions.mountPickedSandboxes,
  {
    success: [
      set(state`explore.pickedSandboxes`, props`pickedSandboxes`),
      set(state`explore.pickedSandboxesLoading`, false),
    ],
    error: [
      addNotification(
        'There has been a problem getting the sandboxes',
        'error'
      ),
    ],
  },
];

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
    success: [
      addNotification('Sandbox picked', 'success'),
      set(state`currentModal`, null),
    ],
    error: [
      addNotification('There has been a problem picking the sandbox', 'error'),
    ],
  },
];

export const pickSandboxModal = [
  actions.setDetails,
  set(state`currentModal`, 'pickSandbox'),
];

export const getSandbox = [
  actions.getSandbox,
  {
    success: [set(state`explore.selectedSandbox`, props`selectedSandbox`)],
    error: [
      addNotification('There has been a problem getting the sandbox', 'error'),
    ],
  },
];
