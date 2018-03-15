import { set, equals, push } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';

import * as factories from '../../factories';
import { setSandbox } from '../../sequences';

import { changeCode } from '../editor/sequences';
import { setModuleSaved } from '../editor/actions';
import { removeModule, removeDirectory } from '../files/actions';
import * as actions from './actions';
import * as flow from './flow';

export const initializeLive = factories.withLoadApp([
  set(state`live.isLoading`, true),
  actions.connect,
  actions.joinChannel,
  {
    success: [
      set(props`listenSignalPath`, 'live.liveMessageReceived'),
      actions.initializeLiveState,
      actions.listen,
    ],
    error: set(state`live.error`, props`reason`),
  },
]);

export const handleMessage = [
  equals(props`event`),
  {
    'user:entered': [
      set(state`live.roomInfo.users`, props`data.users`),
      flow.isCurrentEditor,
      {
        true: [actions.sendCurrentState, set(state`live.isLoading`, false)],
        false: [],
      },
    ],
    state: [
      flow.isCurrentEditor,
      {
        true: [],
        false: [
          actions.consumeState,
          set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
          setSandbox,
          set(
            state`editor.changedModuleShortids`,
            props`changedModuleShortids`
          ),
          // Whether this is first load
          equals(state`live.isLoading`),
          {
            true: [
              set(state`editor.tabs`, props`tabs`),
              set(
                state`editor.currentModuleShortid`,
                props`currentModuleShortid`
              ),
              set(state`live.isLoading`, false),
            ],
            false: [],
          },
        ],
      },
    ],
    code: [
      flow.isCurrentEditor,
      {
        true: [],
        false: [
          actions.consumeModule,
          set(props`code`, props`module.code`),
          changeCode,
        ],
      },
    ],
    'module:saved': [
      flow.isCurrentEditor,
      {
        true: [],
        false: [
          actions.consumeModule,
          set(props`shortid`, props`moduleShortid`),
          changeCode,
          setModuleSaved,
        ],
      },
    ],
    'module:created': [
      flow.isCurrentEditor,
      {
        true: [],
        false: [
          actions.consumeModule,
          push(state`editor.currentSandbox.modules`, props`module`),
        ],
      },
    ],
    'module:updated': [
      flow.isCurrentEditor,
      {
        true: [],
        false: [actions.consumeModule, actions.updateModule],
      },
    ],
    'module:deleted': [
      flow.isCurrentEditor,
      {
        true: [],
        false: [actions.consumeModule, removeModule],
      },
    ],
    'directory:created': [
      flow.isCurrentEditor,
      {
        true: [],
        false: [
          actions.consumeModule,
          push(state`editor.currentSandbox.directories`, props`module`),
        ],
      },
    ],
    'directory:updated': [
      flow.isCurrentEditor,
      {
        true: [],
        false: [actions.consumeModule, actions.updateDirectory],
      },
    ],
    'directory:deleted': [
      flow.isCurrentEditor,
      {
        true: [],
        false: [
          actions.consumeModule,
          set(props`directoryShortid`, props`moduleShortid`),
          removeDirectory,
        ],
      },
    ],
    otherwise: [],
  },
];

export const createLive = [
  set(state`live.isOwner`, true),
  actions.createRoom,
  initializeLive,
];
