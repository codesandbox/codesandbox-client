import { set, equals, when } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';

import { syncSandbox } from '../files/sequences';

import * as actions from './actions';

export const restartSandbox = [actions.restartSandbox];
export const restartContainer = [
  set(state`server.containerStatus`, 'initializing'),
  actions.restartContainer,
];

export const setStatus = [set(state`server.status`, props`status`)];

export const setContainerStatus = [
  set(state`server.containerStatus`, props`status`),
];

export const onSSEMessage = [
  equals(props`event`),
  {
    connect: [set(state`server.status`, 'connected')],
    disconnect: [
      when(
        state`server.containerStatus`,
        state`server.status`,
        (containerStatus, managerStatus) =>
          containerStatus !== 'hibernated' && managerStatus === 'connected'
      ),

      {
        true: [set(state`server.status`, 'disconnected')],
        false: [],
      },
    ],
    'sandbox:start': [set(state`server.containerStatus`, 'sandbox-started')],
    'sandbox:stop': [set(state`server.containerStatus`, 'stopped')],
    'sandbox:update': [set(props`updates`, props`data.updates`), syncSandbox],
    'sandbox:hibernated': [set(state`server.containerStatus`, 'hibernated')],
    'sandbox:log': [actions.logSandboxMessage],
    'sandbox:status': [
      equals(props`data.status`),
      {
        'starting-container': [
          set(state`server.containerStatus`, 'initializing'),
        ],
        'installing-packages': [
          set(state`server.containerStatus`, 'container-started'),
        ],
        otherwise: [],
      },
    ],
  },
];
