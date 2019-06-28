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

export const onCodeSandboxAPIMessage = [
  equals(props`data.type`),
  {
    'socket:message': [actions.sendShellMessage],
    otherwise: [],
  },
];

export const openBrowserFromPort = [actions.openBrowserFromPort];

export const onSSEMessage = [
  equals(props`event`),
  {
    connect: [
      set(state`server.error`, undefined),
      set(state`server.status`, 'connected'),
    ],
    disconnect: [
      when(
        state`server.containerStatus`,
        state`server.status`,
        (containerStatus, managerStatus) =>
          containerStatus !== 'hibernated' && managerStatus === 'connected'
      ),

      {
        true: [
          set(state`server.status`, 'disconnected'),
          actions.sendDisconnectedMessage,
        ],
        false: [],
      },
    ],
    'sandbox:start': [set(state`server.containerStatus`, 'sandbox-started')],
    'sandbox:stop': [
      equals(state`server.containerStatus`),
      {
        hibernated: [],
        otherwise: [set(state`server.containerStatus`, 'stopped')],
      },
    ],
    'sandbox:update': [set(props`updates`, props`data.updates`), syncSandbox],
    'sandbox:hibernate': [
      set(state`server.containerStatus`, 'hibernated'),
      actions.closeSocket,
    ],
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

    'sandbox:log': [actions.logSandboxMessage],
    'sandbox:port': [
      set(props`ports`, props`data`),
      actions.showPortClosedNotifications,
      actions.showPortOpenedNotifications,
      actions.setPorts,
    ],
    'sandbox:error': [
      actions.formatErrorMessage,
      set(state`server.hasUnrecoverableError`, props`unrecoverable`),
      set(state`server.error`, props`error`),
      actions.showContainerError,

      equals(state`server.hasUnrecoverableError`),
      {
        true: [actions.closeSocket],
        false: [],
      },
    ],
    // This will be removed and moved to the actual terminal listener
    'shell:exit': [actions.sendShellExit],
    'shell:out': [actions.sendShellOut],
  },
];
