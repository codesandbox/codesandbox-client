import {
  unset,
  set,
  concat,
  push,
  when,
  equals,
  toggle,
} from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import VERSION from 'common/version';

import * as factories from '../../factories';
import { setSandbox, openModal, resetLive } from '../../sequences';

import { changeCode, changeCurrentModule } from '../editor/sequences';
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

const isOwnMessage = when(props`_isOwnMessage`);

export const applySelectionsForModule = [
  actions.getSelectionsForCurrentModule,
  concat(state`editor.pendingUserSelections`, props`selections`),
];

export const changeMode = [
  equals(state`live.isOwner`),
  {
    true: [set(state`live.roomInfo.mode`, props`mode`), actions.sendMode],
    false: [],
  },
];

export const closeSession = [
  equals(state`live.isOwner`),
  {
    true: [actions.disconnect, resetLive],
    false: [],
  },
];

export const toggleNotificationsHidden = [
  toggle(state`live.notificationsHidden`),
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
      set(state`live.roomInfo.connectionCount`, props`data.connection_count`),
      set(props`data.user_id`, props`data.joined_user_id`),
      isOwnMessage,
      {
        false: [
          equals(state`live.notificationsHidden`),
          {
            false: [
              actions.getUserJoinedNotification,
              factories.addNotification(props`message`, 'notice'),
            ],
            true: [],
          },
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
      equals(state`live.notificationsHidden`),
      {
        true: [],
        false: [
          actions.getUserLeftNotification,
          factories.addNotification(props`message`, 'notice'),
        ],
      },
      set(props`data.user_id`, props`data.left_user_id`),
      actions.clearUserSelections,
      actions.consumeUserState,
      set(state`live.roomInfo.users`, props`users`),
      set(state`live.roomInfo.connectionCount`, props`data.connection_count`),
      when(props`data.multiple_connections`),
      {
        true: [],
        false: unset(
          state`live.roomInfo.usersMetadata.${props`data.left_user_id`}`
        ),
      },
    ],
    state: [
      when(state`live.isOwner`),
      {
        true: [],
        false: [
          actions.consumeState,
          set(
            state`editor.changedModuleShortids`,
            props`changedModuleShortids`
          ),
          set(state`live.roomInfo`, props`roomInfo`),
          when(state`live.roomInfo.version`, v => v !== VERSION),
          {
            true: [set(props`modal`, 'liveVersionMismatch'), openModal],
            false: [],
          },
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
    'module:mass-created': [
      isOwnMessage,
      {
        true: [],
        false: [
          concat(state`editor.currentSandbox.modules`, props`data.modules`),
          concat(
            state`editor.currentSandbox.directories`,
            props`data.directories`
          ),
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

          when(
            state`live.followingUserId`,
            props`data.user_id`,
            props`data.moduleShortid`,
            state`editor.currentModuleShortid`,
            (followingId, userId, moduleShortid, currentModuleShortid) =>
              followingId === userId && moduleShortid !== currentModuleShortid
          ),
          {
            true: [
              set(props`moduleShortid`, props`data.moduleShortid`),
              actions.getModuleIdFromShortid,
              changeCurrentModule,
            ],
            false: [],
          },
        ],
      },
    ],
    'live:mode': [
      isOwnMessage,
      {
        true: [],
        false: [set(state`live.roomInfo.mode`, props`data.mode`)],
      },
      // Reset user selections, because we can maybe see more (or see less) selections.
      // In classroom mode you only see selections of editors.
      actions.clearUserSelections,
      applySelectionsForModule,
    ],
    'live:chat_enabled': [
      isOwnMessage,
      {
        true: [],
        false: [set(state`live.roomInfo.chatEnabled`, props`data.enabled`)],
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
      equals(state`live.isLoading`),
      {
        false: [
          isOwnMessage,
          {
            true: actions.acknowledgeOperation,
            false: actions.receiveTransformation,
          },
        ],
        true: [],
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
      when(
        state`live.roomInfo.ownerId`,
        state`live.user.id`,
        (i1, i2) => i1 === i2
      ),
      {
        true: [],
        false: [set(state`editor.currentSandbox.owned`, false)],
      },
      resetLive,
    ],
    chat: [actions.receiveChat],
    notification: [
      factories.addNotification(props`data.message`, props`data.type`),
    ],
    otherwise: [],
  },
];

export const sendSelection = [
  equals(state`live.isCurrentEditor`),
  {
    true: [actions.sendSelection],
    false: [],
  },
];

export const createLive = [
  factories.track('create-live', {}),
  set(state`live.isOwner`, true),
  actions.createRoom,
  initializeLive,
];

export const sendTransform = [
  equals(state`live.isCurrentEditor`),
  {
    true: [actions.sendTransform],
    false: [],
  },
];

export const applyTransformation = [
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

export const sendChat = [actions.sendChat];

export const setChatEnabled = [
  factories.track('live-chat-enabled', {}),
  equals(state`live.isOwner`),
  {
    true: [
      set(state`live.roomInfo.chatEnabled`, props`enabled`),
      actions.sendChatEnabled,
    ],
    false: [],
  },
];

export const setFollowing = [
  factories.track('live-follow-user', {}),
  set(state`live.followingUserId`, props`userId`),
  actions.getCurrentModuleIdOfUser,
  when(props`moduleShortid`),
  {
    true: [actions.getModuleIdFromShortid, changeCurrentModule],
    false: [],
  },
];
