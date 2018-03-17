import { set, push, when, equals } from 'cerebral/operators';
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

const isOwnMessage = when(
  props`data.userId`,
  state`user.id`,
  (givenId, localId) => givenId === localId
);

export const handleMessage = [
  equals(props`event`),
  {
    'user:entered': [
      set(state`live.roomInfo.users`, props`data.users`),
      flow.isCurrentEditor,
      {
        true: [
          actions.addUserMetadata,
          actions.sendCurrentState,
          set(state`live.isLoading`, false),
        ],
        false: [],
      },
    ],
    state: [
      isOwnMessage,
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
          set(state`live.roomInfo`, props`roomInfo`),
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
    'module:saved': [
      isOwnMessage,
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
      isOwnMessage,
      {
        true: [],
        false: [
          actions.consumeModule,
          push(state`editor.currentSandbox.modules`, props`module`),
        ],
      },
    ],
    'module:updated': [
      isOwnMessage,
      {
        true: [],
        false: [actions.consumeModule, actions.updateModule],
      },
    ],
    'module:deleted': [
      isOwnMessage,
      {
        true: [],
        false: [actions.consumeModule, removeModule],
      },
    ],
    'directory:created': [
      isOwnMessage,
      {
        true: [],
        false: [
          actions.consumeModule,
          push(state`editor.currentSandbox.directories`, props`module`),
        ],
      },
    ],
    'directory:updated': [
      isOwnMessage,
      {
        true: [],
        false: [actions.consumeModule, actions.updateDirectory],
      },
    ],
    'directory:deleted': [
      isOwnMessage,
      {
        true: [],
        false: [
          actions.consumeModule,
          set(props`directoryShortid`, props`moduleShortid`),
          removeDirectory,
        ],
      },
    ],
    'user:selection': [
      isOwnMessage,
      {
        true: [],
        false: [actions.updateSelection, actions.sendSelectionToEditor],
      },
    ],
    operation: [
      isOwnMessage,
      {
        true: actions.acknowledgeOperation,
        false: actions.receiveTransformation,
      },
    ],
    otherwise: [],
  },
];

export const sendSelection = [actions.sendSelection];

export const createLive = [
  set(state`live.isOwner`, true),
  actions.createRoom,
  initializeLive,
];

export const sendTransform = [actions.sendTransform];

export const applyTransformation = [
  actions.setReceivingStatus,
  when(
    state`editor.currentModuleShortid`,
    props`moduleShortid`,
    (s1, s2) => s1 === s2
  ),
  {
    true: [
      actions.computePendingOperation,
      set(state`editor.pendingOperation`, props`pendingOperation`),
    ],
    false: [actions.applyTransformation, changeCode],
  },
  actions.unSetReceivingStatus,
];

export const unSetReceivingStatus = [actions.unSetReceivingStatus];

export const clearPendingOperation = [
  set(state`editor.pendingOperation`, null),
];
