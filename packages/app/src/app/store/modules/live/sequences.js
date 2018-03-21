import { unset, set, push, when, equals } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';

import * as factories from '../../factories';
import { setSandbox, openModal, resetLive } from '../../sequences';

import { changeCode } from '../editor/sequences';
import { setModuleSaved } from '../editor/actions';
import { removeModule, removeDirectory } from '../files/sequences';
import * as actions from './actions';

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
  props`data.user_id`,
  state`user.id`,
  (givenId, localId) => givenId === localId
);

export const applySelectionsForModule = [
  actions.getSelectionsForCurrentModule,
  set(state`editor.pendingUserSelections`, props`selections`),
];

export const changeMode = [
  equals(state`live.isOwner`),
  {
    true: [set(state`live.roomInfo.mode`, props`mode`), actions.sendMode],
    false: [],
  },
];

export const handleMessage = [
  equals(props`event`),
  {
    join: [
      set(props`message`, 'Connected to Live!'),
      factories.addNotification(props`message`, 'success'),
      when(state`live.reconnecting`),
      {
        true: [actions.resendOutboundOTTransforms],
        false: [],
      },
      set(state`live.reconnecting`, false),
    ],
    'user:entered': [
      actions.consumeUserState,
      set(state`live.roomInfo.users`, props`users`),
      set(props`data.user_id`, props`data.joined_user_id`),
      isOwnMessage,
      {
        false: [
          actions.getUserJoinedNotification,
          factories.addNotification(props`message`, 'notice'),
        ],
        true: [],
      },
      equals(state`live.isOwner`),
      {
        true: [
          actions.addUserMetadata,
          actions.sendCurrentState,
          set(state`live.isLoading`, false),
        ],
        false: [],
      },
    ],
    'user:left': [
      actions.getUserLeftNotification,
      factories.addNotification(props`message`, 'notice'),
      set(props`data.user_id`, props`data.left_user_id`),
      actions.clearUserSelections,
      actions.consumeUserState,
      set(state`live.roomInfo.users`, props`users`),
      unset(state`live.roomInfo.usersMetadata.${props`data.left_user_id`}`),
    ],
    state: [
      isOwnMessage,
      {
        true: [],
        false: [
          actions.consumeState,
          set(
            state`editor.changedModuleShortids`,
            props`changedModuleShortids`
          ),
          set(state`live.roomInfo`, props`roomInfo`),
          // Whether this is first load
          equals(state`live.isLoading`),
          {
            true: [
              actions.consumeOTData,
              set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
              setSandbox,
              set(state`editor.tabs`, props`tabs`),
              set(
                state`editor.currentModuleShortid`,
                props`currentModuleShortid`
              ),
              set(state`live.isLoading`, false),
            ],
            false: [],
          },
          applySelectionsForModule,
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
          set(props`code`, props`module.code`),
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
        false: [actions.consumeModule, removeDirectory],
      },
    ],
    'user:selection': [
      isOwnMessage,
      {
        true: [],
        false: [actions.updateSelection, actions.sendSelectionToEditor],
      },
    ],
    'user:current-module': [
      isOwnMessage,
      {
        true: [],
        false: [
          set(
            state`live.roomInfo.usersMetadata.${props`data.user_id`}.currentModuleShortid`,
            props`data.moduleShortid`
          ),
          actions.clearUserSelections,
        ],
      },
    ],
    'live:mode': [
      isOwnMessage,
      {
        true: [],
        false: [set(state`live.roomInfo.mode`, props`data.mode`)],
      },
    ],
    'live:add-editor': [
      isOwnMessage,
      {
        false: [
          push(state`live.roomInfo.editorIds`, props`data.editor_user_id`),
        ],
        true: [],
      },
    ],
    'live:remove-editor': [
      isOwnMessage,
      {
        false: [actions.removeEditorFromState],
        true: [],
      },
    ],
    operation: [
      isOwnMessage,
      {
        true: actions.acknowledgeOperation,
        false: actions.receiveTransformation,
      },
    ],
    'connection-loss': [
      equals(state`live.reconnecting`),
      {
        false: [
          set(
            props`message`,
            'We lost connection with the live server, reconnecting...'
          ),
          factories.addNotification(props`message`, 'error'),
          set(state`live.reconnecting`, true),
        ],
        true: [],
      },
    ],
    disconnect: [
      actions.disconnect,
      set(props`modal`, 'liveSessionEnded'),
      openModal,
      resetLive,
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

export const clearPendingUserSelections = [
  set(state`editor.pendingUserSelections`, []),
];

export const addEditor = [
  push(state`live.roomInfo.editorIds`, props`userId`),
  actions.addEditor,
];

export const removeEditor = [
  actions.removeEditorFromState,
  actions.removeEditor,
];
