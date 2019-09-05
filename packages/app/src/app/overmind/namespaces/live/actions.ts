import { LiveMessageEvent } from '@codesandbox/common/lib/types';
import { AsyncAction, Action, Operator } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import { camelizeKeys } from 'humps';
import { TextOperation } from 'ot';
import { json, fork, mutate, pipe, filter } from 'overmind';
import * as internalActions from './internalActions';

export const internal = internalActions;

export const roomJoined: AsyncAction<{
  roomId: string;
}> = withLoadApp(async ({ state, effects, actions }, { roomId }) => {
  const sandbox = await actions.live.internal.initialize(roomId);

  if (state.updateStatus === 'available') {
    const modal = 'liveVersionMismatch';
    effects.analytics.track('Open Modal', { modal });
    state.currentModal = modal;
  }

  actions.internal.setCurrentSandbox(sandbox);
  state.live.isLoading = false;
});

export const createLiveClicked: AsyncAction<{
  sandboxId: string;
}> = async ({ state, effects, actions }, { sandboxId }) => {
  effects.analytics.track('Create Live Session');

  const roomId = await effects.api.createLiveRoom(sandboxId);
  await actions.live.internal.initialize(roomId);

  state.live.isLoading = false;
};

export const liveMessageReceived: Operator<{
  event: LiveMessageEvent;
  data: any;
  _isOwnMessage: boolean;
  liveUserId: string;
}> = pipe(
  filter((_, payload) =>
    Object.values(LiveMessageEvent).includes(payload.event)
  ),
  fork((_, payload) => payload.event, {
    [LiveMessageEvent.JOIN]: mutate(({ effects, state }) => {
      effects.notificationToast.success(
        state.live.isTeam ? 'Connected to Live Team!' : 'Connected to Live!'
      );

      if (state.live.reconnecting) {
        effects.live.getAllClients().forEach(client => {
          client.serverReconnect();
        });
      }

      state.live.reconnecting = false;
    }),
    [LiveMessageEvent.MODULE_STATE]: mutate(({ state, actions }, { data }) => {
      // We get this when we notice that there is an out of sync
      // Really no reason to set this state as everything runs sync
      state.live.receivingCode = true;
      actions.live.internal.initializeModuleState(data.module_state);
      state.live.receivingCode = false;
    }),
    [LiveMessageEvent.USER_ENTERED]: mutate(({ state, effects }, { data }) => {
      if (state.live.isLoading) {
        return;
      }

      const users = camelizeKeys(data.users);

      // TODO: What happening here? Is it not an array of users?
      // Check the running code and fix the type
      state.live.roomInfo.users = users as any;
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
    }),
    [LiveMessageEvent.USER_LEFT]: mutate(
      ({ state, actions, effects }, { data }) => {
        if (!state.live.notificationsHidden) {
          const users = state.live.roomInfo.users;
          const user = users
            ? users.find(u => u.id === data.left_user_id)
            : null;

          effects.notificationToast.add({
            message: user
              ? `${user.username} left the live session.`
              : 'Someone left the live session',
            status: NotificationStatus.NOTICE,
          });
        }

        actions.live.internal.clearUserSelections(data.left_user_id);

        const users = camelizeKeys(data.users);

        // TODO: Same here, not an array?
        // Check running code
        state.live.roomInfo.users = users as any;
        state.live.roomInfo.ownerIds = data.owner_ids;
        state.live.roomInfo.editorIds = data.editor_ids;
      }
    ),
    [LiveMessageEvent.MODULE_SAVED]: mutate(
      ({ state, actions }, { _isOwnMessage, data }) => {
        if (_isOwnMessage) {
          return;
        }
        const module = state.editor.currentSandbox.modules.find(
          moduleItem => moduleItem.shortid === data.moduleShortid
        );
        module.isNotSynced = false;
        actions.editor.internal.setModuleSavedCode({
          moduleShortid: data.moduleShortid,
          savedCode: data.savedCode,
        });
      }
    ),
    [LiveMessageEvent.MODULE_CREATED]: mutate(
      ({ state }, { _isOwnMessage, data }) => {
        if (_isOwnMessage) {
          return;
        }
        state.editor.currentSandbox.modules.push(data);
      }
    ),
    [LiveMessageEvent.MODULE_MASS_CREATED]: mutate(
      ({ state }, { _isOwnMessage, data }) => {
        if (_isOwnMessage) {
          return;
        }
        state.editor.currentSandbox.modules = state.editor.currentSandbox.modules.concat(
          data.modules
        );
        state.editor.currentSandbox.directories = state.editor.currentSandbox.directories.concat(
          data.directories
        );
      }
    ),
    [LiveMessageEvent.MODULE_UPDATED]: mutate(
      ({ state }, { _isOwnMessage, data }) => {
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
      }
    ),
    [LiveMessageEvent.MODULE_DELETED]: mutate(
      ({ actions }, { _isOwnMessage, data }) => {
        if (_isOwnMessage) {
          return;
        }
        // Do not think this really works? Cause this would fork the sandbox
        actions.files.removeModule(data.moduleShortid);
      }
    ),
    [LiveMessageEvent.DIRECTORY_CREATED]: mutate(
      ({ state }, { _isOwnMessage, data }) => {
        if (_isOwnMessage) {
          return;
        }
        // Should this not be a directory?
        state.editor.currentSandbox.directories.push(data.module);
      }
    ),
    [LiveMessageEvent.DIRECTORY_UPDATED]: mutate(
      ({ state }, { _isOwnMessage, data }) => {
        if (_isOwnMessage) {
          return;
        }
        const sandbox = state.editor.currentSandbox;
        const directoryIndex = sandbox.directories.findIndex(
          directoryEntry => directoryEntry.shortid === data.directoryShortid
        );

        state.editor.sandboxes[sandbox.id].directories[directoryIndex] =
          data.module;
      }
    ),
    [LiveMessageEvent.DIRECTORY_DELETED]: mutate(
      ({ state, actions }, { _isOwnMessage, data }) => {
        if (_isOwnMessage) {
          return;
        }
        state.editor.currentModuleShortid = state.editor.mainModule.shortid;
        // Again, this does not work very well?
        actions.files.removeDirectory(data.directoryShortid);
      }
    ),
    [LiveMessageEvent.USER_SELECTION]: mutate(
      ({ state }, { _isOwnMessage, data }) => {
        if (_isOwnMessage) {
          return;
        }

        const userSelectionLiveUserId = data.liveUserId;
        const moduleShortid = data.moduleShortid;
        const selection = data.selection;
        const userIndex = state.live.roomInfo.users.findIndex(
          u => u.id === userSelectionLiveUserId
        );

        if (userIndex > -1) {
          state.live.roomInfo.users[
            userIndex
          ].currentModuleShortid = moduleShortid;
          state.live.roomInfo.users[userIndex].selection = selection;
        }

        if (
          moduleShortid === state.editor.currentModuleShortid &&
          state.live.isEditor(userSelectionLiveUserId)
        ) {
          const user = state.live.roomInfo.users.find(
            u => u.id === userSelectionLiveUserId
          );

          state.editor.pendingUserSelections.push({
            userId: userSelectionLiveUserId,
            name: user.username,
            selection,
            color: json(user.color),
          });
        }
      }
    ),
    [LiveMessageEvent.USER_CURRENT_MODULE]: mutate(
      ({ state, actions }, { _isOwnMessage, data }) => {
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
          actions.editor.moduleSelected({
            id: module.id,
          });
        }
      }
    ),
    [LiveMessageEvent.LIVE_MODE]: mutate(
      ({ state, actions }, { _isOwnMessage, data }) => {
        if (!_isOwnMessage) {
          state.live.roomInfo.mode = data.mode;
        }
        actions.live.internal.clearUserSelections(data);
        state.editor.pendingUserSelections = state.editor.pendingUserSelections.concat(
          actions.live.internal.getSelectionsForModule(
            state.editor.currentModule
          )
        );
      }
    ),
    [LiveMessageEvent.LIVE_CHAT_ENABLED]: mutate(
      ({ state }, { _isOwnMessage, data }) => {
        if (_isOwnMessage) {
          return;
        }
        state.live.roomInfo.chatEnabled = data.enabled;
      }
    ),
    [LiveMessageEvent.LIVE_ADD_EDITOR]: mutate(
      ({ state }, { _isOwnMessage, data }) => {
        if (!_isOwnMessage) {
          state.live.roomInfo.editorIds.push(data.editor_user_id);
        }
      }
    ),
    [LiveMessageEvent.LIVE_REMOVE_EDITOR]: mutate(
      ({ state }, { _isOwnMessage, liveUserId, data }) => {
        if (!_isOwnMessage) {
          const userId = liveUserId || data.editor_user_id;

          const editors = state.live.roomInfo.editorIds;
          const newEditors = editors.filter(id => id !== userId);

          state.live.roomInfo.editorIds = newEditors;
        }
      }
    ),
    [LiveMessageEvent.OPERATION]: mutate(
      ({ state, effects }, { _isOwnMessage, data }) => {
        if (state.live.isLoading) {
          return;
        }
        if (_isOwnMessage) {
          effects.live.getClient(data.module_shortid).serverAck();
        } else {
          try {
            effects.live
              .getClient(data.module_shortid)
              .applyServer(data.operation);
          } catch (e) {
            // Something went wrong, probably a sync mismatch. Request new version
            console.error('Something went wrong with applying OT operation');
            effects.live.sendModuleUpdateRequest();
          }
        }
      }
    ),
    [LiveMessageEvent.CONNECTION_LOSS]: mutate(({ state, effects }) => {
      if (!state.live.reconnecting) {
        effects.notificationToast.add({
          message: 'We lost connection with the live server, reconnecting...',
          status: NotificationStatus.ERROR,
        });
        state.live.reconnecting = true;
      }
    }),
    [LiveMessageEvent.DISCONNECT]: mutate(({ state, actions }, { data }) => {
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
    }),
    [LiveMessageEvent.OWNER_LEFT]: mutate(({ actions }) => {
      actions.modalOpened({
        modal: 'liveSessionEnded',
        message: 'The owner left the session',
      });
    }),
    [LiveMessageEvent.CHAT]: mutate(({ state }, { data }) => {
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
    }),
    [LiveMessageEvent.NOTIFICATION]: mutate(({ effects }, { data }) => {
      effects.notificationToast.add({
        message: data.message,
        status: data.type,
      });
    }),
  })
);

export const onTransformMade: Action<{
  operation: any;
  moduleShortid: string;
}> = ({ effects, state }, { operation, moduleShortid }) => {
  if (!state.live.isCurrentEditor) {
    return;
  }

  if (!operation) {
    return;
  }

  try {
    effects.live.getClient(moduleShortid).applyClient(operation);
  } catch (e) {
    // Something went wrong, probably a sync mismatch. Request new version
    console.error(
      'Something went wrong with applying OT operation',
      moduleShortid,
      operation
    );
    effects.live.send('live:module_state', {});
  }
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
  if (Object.keys(state.editor.pendingOperations).length) {
    state.editor.pendingOperations = {};
  }
};

export const onSelectionChanged: Action<{
  selection: any;
  moduleShortid: string;
}> = ({ state, effects }, { selection, moduleShortid }) => {
  if (state.live.isCurrentEditor) {
    const liveUserId = state.live.liveUserId;
    const userIndex = state.live.roomInfo.users.findIndex(
      u => u.id === liveUserId
    );

    if (userIndex > -1) {
      if (state.live.roomInfo.users[userIndex]) {
        state.live.roomInfo.users[
          userIndex
        ].currentModuleShortid = moduleShortid;

        state.live.roomInfo.users[userIndex].selection = selection;

        effects.live.sendUserSelection(moduleShortid, liveUserId, selection);
      }
    }
  }
};

export const onSelectionDecorationsApplied: Action = ({ state }) => {
  // We only clear it out if we actually need to. There is a reaction
  // running that reacts to any change here
  if (state.editor.pendingUserSelections.length) {
    state.editor.pendingUserSelections = [];
  }
};

export const onModeChanged: Action<{ mode: string }> = (
  { state, effects },
  { mode }
) => {
  if (state.live.isOwner) {
    state.live.roomInfo.mode = mode;
    effects.live.sendLiveMode(mode);
  }
};

export const onAddEditorClicked: Action<{
  liveUserId: string;
}> = ({ state, effects }, { liveUserId }) => {
  state.live.roomInfo.editorIds.push(liveUserId);

  effects.live.sendEditorAdded(liveUserId);
};

export const onRemoveEditorClicked: Action<any> = (
  { state, effects },
  { liveUserId, data }
) => {
  const userId = liveUserId || data.editor_user_id;

  const editors = state.live.roomInfo.editorIds;
  const newEditors = editors.filter(id => id !== userId);

  state.live.roomInfo.editorIds = newEditors;

  effects.live.sendEditorRemoved(liveUserId);
};

export const onSessionCloseClicked: Action = ({ actions, effects }) => {
  effects.live.sendClosed();
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

export const onSendChat: Action<{ message: string }> = (
  { effects },
  { message }
) => {
  effects.live.sendChat(message);
};

export const onChatEnabledChange: Action<{ enabled: boolean }> = (
  { effects, state },
  { enabled }
) => {
  effects.analytics.track('Enable Live Chat');

  if (state.live.isOwner) {
    state.live.roomInfo.chatEnabled = enabled;
    effects.live.sendChatEnabled(enabled);
  }
};

export const onFollow: Action<{
  liveUserId: string;
}> = ({ state, effects, actions }, { liveUserId }) => {
  effects.analytics.track('Follow Along in Live');
  state.live.followingUserId = liveUserId;

  const user = state.live.roomInfo.users.find(u => u.id === liveUserId);

  if (user && user.currentModuleShortid) {
    const modules = state.editor.currentSandbox.modules;
    const module = modules.find(m => m.shortid === user.currentModuleShortid);

    actions.editor.moduleSelected({
      id: module.id,
    });
  }
};

export const onModuleStateMismatch: Action = ({ effects }) => {
  effects.live.sendModuleUpdateRequest();
};
