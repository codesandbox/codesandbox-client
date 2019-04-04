import { set, concat, push, when, equals, toggle } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';

import * as factories from '../../factories';
import { setSandbox, openModal, resetLive } from '../../sequences';

import { changeCurrentModule } from '../editor/sequences';
import { setModuleSaved, setModuleSavedCode } from '../editor/actions';
import { removeModule, removeDirectory } from '../files/sequences';
import * as actions from './actions';
import { initializeLive as commonInitializeLive } from './common-sequences';

export const initializeLive = [
  commonInitializeLive,

  when(state`updateStatus`, s => s === 'available'),
  {
    true: [set(props`modal`, 'liveVersionMismatch'), openModal],
    false: [],
  },

  setSandbox,
  set(state`live.isLoading`, false),
];

const isOwnMessage = when(props`_isOwnMessage`);

export const applySelectionsForModule = [
  actions.getSelectionsForCurrentModule,
  concat(state`editor.pendingUserSelections`, props`selections`),
];

export const changeMode = [
  when(state`live.isOwner`),
  {
    true: [set(state`live.roomInfo.mode`, props`mode`), actions.sendMode],
    false: [],
  },
];

export const stopLive = [actions.disconnect, resetLive];

export const closeSession = [actions.sendCloseSession, stopLive];

export const toggleNotificationsHidden = [
  toggle(state`live.notificationsHidden`),
];

export const handleMessage = [
  equals(props`event`),
  {
    join: [
      when(state`live.isTeam`),
      {
        true: [set(props`message`, 'Connected to Live Team!')],
        false: [set(props`message`, 'Connected to Live!')],
      },
      factories.addNotification(props`message`, 'success'),
      when(state`live.reconnecting`),
      {
        true: [actions.resendOutboundOTTransforms],
        false: [],
      },
      set(state`live.reconnecting`, false),
    ],
    module_state: [
      // We get this when we notice that there is an out of sync
      actions.consumeModuleState,
      actions.setReceivingStatus,
      actions.initializeModuleState,
      actions.unSetReceivingStatus,
    ],
    'user:entered': [
      when(state`live.isLoading`),
      {
        true: [],
        false: [
          actions.consumeUserState,
          set(state`live.roomInfo.users`, props`users`),
          set(state`live.roomInfo.editorIds`, props`data.editor_ids`),
          set(state`live.roomInfo.ownerIds`, props`data.owner_ids`),
          set(props`data.live_user_id`, props`data.joined_user_id`),
          when(
            props`data.live_user_id`,
            state`live.liveUserId`,
            (a, b) => a === b
          ),
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
        ],
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
      set(props`data.live_user_id`, props`data.left_user_id`),
      actions.clearUserSelections,
      actions.consumeUserState,
      set(state`live.roomInfo.users`, props`users`),
      set(state`live.roomInfo.ownerIds`, props`data.owner_ids`),
      set(state`live.roomInfo.editorIds`, props`data.editor_ids`),
    ],
    'module:saved': [
      isOwnMessage,
      {
        true: [],
        false: [
          actions.consumeModule,
          set(props`shortid`, props`moduleShortid`),
          setModuleSaved,
          set(props`savedCode`, props`module.savedCode`),
          setModuleSavedCode,
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
          actions.changeUserModule,
          actions.clearUserSelections,

          when(
            state`live.followingUserId`,
            props`data.live_user_id`,
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
      equals(props`data.reason`),
      {
        inactivity: [
          set(props`message`, 'The session has ended due to inactivity'),
        ],
        close: [set(props`message`, 'The owner ended the session')],
        otherwise: [
          set(props`message`, 'The session has ended due to inactivity'),
        ],
      },
      set(props`modal`, 'liveSessionEnded'),
      actions.setSandboxOwned,

      openModal,
      resetLive,
    ],
    owner_left: [
      set(props`message`, 'The owner left the session'),
      set(props`modal`, 'liveSessionEnded'),
      openModal,
    ],
    chat: [actions.receiveChat],
    notification: [
      factories.addNotification(props`data.message`, props`data.type`),
    ],
    otherwise: [],
  },
];

export const sendSelection = [
  when(state`live.isCurrentEditor`),
  {
    true: [actions.sendSelection],
    false: [],
  },
];

export const createLive = [
  factories.track('Create Live Session', {}),
  actions.createRoom,
  commonInitializeLive,
  set(state`live.isLoading`, false),
];

export const sendTransform = [
  when(state`live.isCurrentEditor`),
  {
    true: [actions.sendTransform],
    false: [],
  },
];

export const applyTransformation = [
  actions.computePendingOperation,
  set(
    state`editor.pendingOperations.${props`moduleShortid`}`,
    props`pendingOperation`
  ),
  actions.unSetReceivingStatus,
];

export const unSetReceivingStatus = [actions.unSetReceivingStatus];

export const clearPendingOperation = [set(state`editor.pendingOperations`, {})];

export const clearPendingUserSelections = [
  set(state`editor.pendingUserSelections`, []),
];

export const addEditor = [
  push(state`live.roomInfo.editorIds`, props`liveUserId`),
  actions.addEditor,
];

export const removeEditor = [
  actions.removeEditorFromState,
  actions.removeEditor,
];

export const sendChat = [actions.sendChat];

export const setChatEnabled = [
  factories.track('Enable Live Chat', {}),
  when(state`live.isOwner`),
  {
    true: [
      set(state`live.roomInfo.chatEnabled`, props`enabled`),
      actions.sendChatEnabled,
    ],
    false: [],
  },
];

export const setFollowing = [
  factories.track('Follow Along in Live', {}),
  set(state`live.followingUserId`, props`liveUserId`),
  actions.getCurrentModuleIdOfUser,
  when(props`moduleShortid`),
  {
    true: [actions.getModuleIdFromShortid, changeCurrentModule],
    false: [],
  },
];

export const syncModuleState = [actions.syncModuleState];
