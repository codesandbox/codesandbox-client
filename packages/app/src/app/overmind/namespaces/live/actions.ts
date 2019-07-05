import * as internalActions from './internalActions';
import { AsyncAction, Action } from 'app/overmind';
import { RoomInfo } from '@codesandbox/common/lib/types';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import { camelizeKeys } from 'humps';
import { TextOperation } from 'ot';

export const internal = internalActions;

export const roomJoined: AsyncAction = async ({ state, effects, actions }) => {
  await actions.live.internal.initialize();

  if (state.updateStatus === 'available') {
    const modal = 'liveVersionMismatch';
    effects.analytics.track('Open Modal', { modal });
    state.currentModal = modal;
  }

  // Where do we get the sandbox from?
  // actions.internal.setSandbox()
  state.live.isLoading = false;
};

export const createLiveClicked: AsyncAction<string> = async (
  { state, effects, actions },
  id
) => {
  effects.analytics.track('Create Live Session');

  const { id: roomId } = await effects.api.post<any>(`/sandboxes/${id}/live`, {
    id,
  });

  // Hm, need to run this to understand how data is passed
  await actions.live.internal.initialize();

  state.live.isLoading = false;
};

export const liveMessageReceived: AsyncAction<{
  event: string;
  data: any;
  _isOwnMessage: boolean;
  liveUserId: string;
}> = async (
  { state, effects, actions },
  { event, data, _isOwnMessage, liveUserId }
) => {
  switch (event) {
    case 'join': {
      effects.notificationToast.add({
        message: state.live.isTeam
          ? 'Connected to Live Team!'
          : 'Connected to Live!',
        status: NotificationStatus.SUCCESS,
      });

      if (state.live.reconnecting) {
        effects.ot.serverReconnect();
      }

      state.live.reconnecting = false;
      break;
    }
    case 'module_state': {
      // We get this when we notice that there is an out of sync
      // Really no reason to set this state as everything runs sync
      state.live.receivingCode = true;
      actions.live.internal.initializeModuleState(data.module_state);
      state.live.receivingCode = false;
      break;
    }
    case 'user:entered': {
      if (state.live.isLoading) {
        return;
      }

      const users = camelizeKeys(data.users);

      // What happening here? Is it not an array of users?
      state.live.roomInfo.users = users;
      state.live.roomInfo.editorIds = data.editor_ids;
      state.live.roomInfo.ownerIds = data.owner_ids;

      if (data.joined_user_id === state.live.liveUserId) {
        return;
      }

      const user = data.users.find(u => u.id === data.joined_user_id);

      effects.notificationToast.add({
        message: `${user.username} joined the live session.`,
        status: NotificationStatus.NOTICE,
      });
      break;
    }
    case 'user:left': {
      if (!state.live.notificationsHidden) {
        const users = state.live.roomInfo.users;
        const user = users ? users.find(u => u.id === data.left_user_id) : null;

        effects.notificationToast.add({
          message: user
            ? `${user.username} left the live session.`
            : 'Someone left the live session',
          status: NotificationStatus.NOTICE,
        });
      }

      actions.live.internal.clearUserSelections(data.left_user_id);

      const users = camelizeKeys(data.users);

      state.live.roomInfo.users = users;
      state.live.roomInfo.ownerIds = data.owner_ids;
      state.live.roomInfo.editorIds = data.editor_ids;
      break;
    }
    case 'module:saved': {
      if (_isOwnMessage) {
        return;
      }
      actions.editor.internal.setModuleSaved(data.moduleShortid);
      actions.editor.internal.setModuleSavedCode({
        moduleShortid: data.moduleShortid,
        savedCode: data.savedCode,
      });
      break;
    }
    case 'module:created': {
      if (_isOwnMessage) {
        return;
      }
      state.editor.currentSandbox.modules.push(data);
      break;
    }
    case 'module:mass-created': {
      if (_isOwnMessage) {
        return;
      }
      state.editor.currentSandbox.modules = state.editor.currentSandbox.modules.concat(
        data.modules
      );
      state.editor.currentSandbox.directories = state.editor.currentSandbox.directories.concat(
        data.directories
      );
      break;
    }
    case 'module:updated': {
      if (_isOwnMessage) {
        return;
      }
      const sandbox = state.editor.currentSandbox;
      const moduleIndex = sandbox.modules.findIndex(
        moduleEntry => moduleEntry.shortid === data.moduleShortid
      );

      Object.assign(
        state.editor.sandboxes[sandbox.id].modules[moduleIndex],
        data.module
      );
      break;
    }
    case 'module:deleted': {
      if (_isOwnMessage) {
        return;
      }
      // Do not think this really works? Cause this would fork the sandbox
      actions.files.removeModule(data.moduleShortid);
      break;
    }
    case 'directory:created': {
      if (_isOwnMessage) {
        return;
      }
      // Should this not be a directory?
      state.editor.currentSandbox.directories.push(data.module);
      break;
    }
    case 'directory:updated': {
      if (_isOwnMessage) {
        return;
      }
      const sandbox = state.editor.currentSandbox;
      const directoryIndex = sandbox.directories.findIndex(
        directoryEntry => directoryEntry.shortid === data.directoryShortid
      );

      state.editor.sandboxes[sandbox.id].directories[directoryIndex] =
        data.module;
      break;
    }
    case 'directory:deleted': {
      if (_isOwnMessage) {
        return;
      }
      state.editor.currentModuleShortid = state.editor.mainModule.shortid;
      // Again, this does not work very well?
      actions.files.removeDirectory(data.directoryShortid);
      break;
    }
    case 'user:selection': {
      if (_isOwnMessage) {
        return;
      }
      actions.live.internal.updateSelection(data);
      actions.live.internal.sendSelectionToEditor(data);
      break;
    }
    case 'user:current-module': {
      if (_isOwnMessage) {
        return;
      }
      const userIndex = state.live.roomInfo.users.findIndex(
        u => u.id === data.live_user_id
      );

      if (userIndex > -1) {
        state.live.roomInfo.users[userIndex].currentModuleShortid =
          data.moduleShortid;
      }

      actions.live.internal.clearUserSelections(data);

      if (
        state.live.followingUserId === data.live_user_id &&
        data.moduleShortid !== state.editor.currentModuleShortid
      ) {
        const moduleShortid = data.moduleShortid;
        const modules = state.editor.currentSandbox.modules;

        const module = modules.find(m => m.shortid === moduleShortid);

        if (!module) {
          return;
        }

        // This will also cause forking?
        actions.editor.moduleSelected(module.id);
      }
      break;
    }
    case 'live:mode': {
      if (!_isOwnMessage) {
        state.live.roomInfo.mode = data.mode;
      }
      actions.live.internal.clearUserSelections(data);
      state.editor.pendingUserSelections = state.editor.pendingUserSelections.concat(
        actions.live.internal.getSelectionsForCurrentModule()
      );
      break;
    }
    case 'live:chat_enabled': {
      if (_isOwnMessage) {
        return;
      }
      state.live.roomInfo.chatEnabled = data.enabled;
      break;
    }
    case 'live:add-editor': {
      if (!_isOwnMessage) {
        state.live.roomInfo.editorIds.push(data.editor_user_id);
      }
      break;
    }
    case 'live:remove-editor': {
      if (!_isOwnMessage) {
        const userId = liveUserId || data.editor_user_id;

        const editors = state.live.roomInfo.editorIds;
        const newEditors = editors.filter(id => id !== userId);

        state.live.roomInfo.editorIds = newEditors;
      }
      break;
    }
    case 'operation': {
      if (state.live.isLoading) {
        return;
      }
      if (_isOwnMessage) {
        effects.ot.serverAck(data.module_shortid);
      } else {
        try {
          effects.ot.applyServer(data.module_shortid, data.operation);
        } catch (e) {
          // Something went wrong, probably a sync mismatch. Request new version
          console.error('Something went wrong with applying OT operation');
          effects.live.send('live:module_state', {});
        }
      }
      break;
    }
    case 'connection-loss': {
      if (!state.live.reconnecting) {
        effects.notificationToast.add({
          message: 'We lost connection with the live server, reconnecting...',
          status: NotificationStatus.ERROR,
        });
        state.live.reconnecting = true;
      }
      break;
    }
    case 'disconnect': {
      actions.live.internal.disconnect();

      state.editor.currentSandbox.owned = state.live.isOwner;

      actions.modalOpened({
        modal: 'liveSessionEnded',
        message:
          data.reason === 'close'
            ? 'The owner ended the session'
            : 'The session has ended due to inactivity',
      });

      actions.live.internal.reset();

      break;
    }
    case 'owner_left': {
      actions.modalOpened({
        modal: 'liveSessionEnded',
        message: 'The owner left the session',
      });
      break;
    }
    case 'chat': {
      let name = state.live.roomInfo.chat.users[data.live_user_id];

      if (!name) {
        const user = state.live.roomInfo.users.find(
          u => u.id === data.live_user_id
        );

        if (user) {
          state.live.roomInfo.chat.users[data.live_user_id] = user.username;
          name = user.username;
        } else {
          name = 'Unknown User';
        }
      }

      state.live.roomInfo.chat.messages.push({
        userId: data.live_user_id,
        message: data.message,
        date: data.date,
      });
      break;
    }
    case 'notification': {
      effects.notificationToast.add({
        message: data.message,
        status: data.type,
      });
    }
  }
};

export const onTransformMade: Action<{
  operation: any;
  moduleShortid: string;
}> = ({ actions, state }, { operation, moduleShortid }) => {
  if (!state.live.isCurrentEditor) {
    return;
  }

  actions.live.internal.sendTransform({ operation, moduleShortid });
};

export const applyTransformation: Action<{
  operation: any;
  moduleShortid: string;
}> = ({ state }, { operation, moduleShortid }) => {
  let pendingOperation;

  const existingPendingOperation =
    state.editor.pendingOperations[moduleShortid];

  if (existingPendingOperation) {
    pendingOperation = TextOperation.fromJSON(existingPendingOperation)
      .compose(TextOperation.fromJSON(operation))
      .toJSON();
  } else {
    pendingOperation = operation;
  }

  state.editor.pendingOperations[moduleShortid] = pendingOperation;
  state.live.receivingCode = false;
};

export const onCodeReceived: Action = ({ state }) => {
  state.live.receivingCode = false;
};

export const onOperationApplied: Action = ({ state }) => {
  state.editor.pendingOperations = {};
};

export const onSelectionChanged: Action<{
  selection: any;
  moduleShortid: string;
}> = ({ state, actions }, { selection, moduleShortid }) => {
  if (state.live.isCurrentEditor) {
    actions.live.internal.sendSelection({
      selection,
      moduleShortid,
    });
  }
};

export const onSelectionDecorationsApplied: Action = ({ state }) => {
  state.editor.pendingUserSelections = [];
};

export const onModeChanged: Action<string> = ({ state, effects }, mode) => {
  if (state.live.isOwner) {
    state.live.roomInfo.mode = mode;
    effects.live.send('live:mode', {
      mode,
    });
  }
};

export const onAddEditorClicked: Action<string> = (
  { state, effects },
  liveUserId
) => {
  state.live.roomInfo.editorIds.push(liveUserId);

  effects.live.send('live:add-editor', {
    editor_user_id: liveUserId,
  });
};

export const onRemoveEditorClicked: Action<any> = (
  { state, effects },
  { liveUserId, data }
) => {
  const userId = liveUserId || data.editor_user_id;

  const editors = state.live.roomInfo.editorIds;
  const newEditors = editors.filter(id => id !== userId);

  state.live.roomInfo.editorIds = newEditors;

  effects.live.send('live:remove-editor', {
    editor_user_id: liveUserId,
  });
};

export const onSessionCloseClicked: Action = ({ actions, effects }) => {
  effects.live.send('live:close', {});
  actions.live.internal.disconnect();
  actions.live.internal.reset();
};

export const onNavigateAway: Action = ({ actions }) => {
  actions.live.internal.disconnect();
  actions.live.internal.reset();
};

export const onToggleNotificationsHidden: Action = ({ state }) => {
  state.live.notificationsHidden = !state.live.notificationsHidden;
};

export const onSendChat: Action<string> = ({ effects }, message) => {
  effects.live.send('chat', {
    message,
  });
};

export const onChatEnabledChange: Action<boolean> = (
  { effects, state },
  isEnabled
) => {
  effects.analytics.track('Enable Live Chat');

  if (state.live.isOwner) {
    state.live.roomInfo.chatEnabled = isEnabled;
    effects.live.send('live:chat_enabled', { enabled: isEnabled });
  }
};

export const onFollow: Action<{
  liveUserId: string;
  moduleShortid: string;
}> = ({ state, effects, actions }, { liveUserId, moduleShortid }) => {
  effects.analytics.track('Follow Along in Live');
  state.live.followingUserId = liveUserId;

  const userIndex = state
    .get('live.roomInfo.users')
    .findIndex(u => u.id === liveUserId);

  if (userIndex > -1) {
    const user = state.live.roomInfo.users[userIndex];

    if (user) {
      moduleShortid: user.currentModuleShortid;
    }
  }

  if (moduleShortid) {
    actions.editor.moduleSelected(
      actions.live.internal.getModuleIdFromShortid(moduleShortid)
    );
  }
};

export const onModuleStateMismatch: Action = ({ effects }) => {
  effects.live.send('live:module_state', {});
};
