import { LiveMessageEvent, LiveMessage } from '@codesandbox/common/lib/types';
import { fork, pipe, filter } from 'overmind';
import { AsyncAction, Action, Operator } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';
import { TextOperation } from 'ot';
import * as internalActions from './internalActions';
import * as liveMessage from './liveMessageOperators';

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
};

export const liveMessageReceived: Operator<LiveMessage> = pipe(
  filter((_, payload) =>
    Object.values(LiveMessageEvent).includes(payload.event)
  ),
  fork((_, payload) => payload.event, {
    [LiveMessageEvent.JOIN]: liveMessage.onJoin,
    [LiveMessageEvent.MODULE_STATE]: liveMessage.onModuleState,
    [LiveMessageEvent.USER_ENTERED]: liveMessage.onUserEntered,
    [LiveMessageEvent.USER_LEFT]: liveMessage.onUserLeft,
    [LiveMessageEvent.MODULE_SAVED]: liveMessage.onModuleSaved,
    [LiveMessageEvent.MODULE_CREATED]: liveMessage.onModuleCreated,
    [LiveMessageEvent.MODULE_MASS_CREATED]: liveMessage.onModuleMassCreated,
    [LiveMessageEvent.MODULE_UPDATED]: liveMessage.onModuleUpdated,
    [LiveMessageEvent.MODULE_DELETED]: liveMessage.onModuleDeleted,
    [LiveMessageEvent.DIRECTORY_CREATED]: liveMessage.onDirectoryCreated,
    [LiveMessageEvent.DIRECTORY_UPDATED]: liveMessage.onDirectoryUpdated,
    [LiveMessageEvent.DIRECTORY_DELETED]: liveMessage.onDirectoryDeleted,
    [LiveMessageEvent.USER_SELECTION]: liveMessage.onUserSelection,
    [LiveMessageEvent.USER_CURRENT_MODULE]: liveMessage.onUserCurrentModule,
    [LiveMessageEvent.LIVE_MODE]: liveMessage.onLiveMode,
    [LiveMessageEvent.LIVE_CHAT_ENABLED]: liveMessage.onLiveChatEnabled,
    [LiveMessageEvent.LIVE_ADD_EDITOR]: liveMessage.onLiveAddEditor,
    [LiveMessageEvent.LIVE_REMOVE_EDITOR]: liveMessage.onLiveRemoveEditor,
    [LiveMessageEvent.OPERATION]: liveMessage.onOperation,
    [LiveMessageEvent.CONNECTION_LOSS]: liveMessage.onConnectionLoss,
    [LiveMessageEvent.DISCONNECT]: liveMessage.onDisconnect,
    [LiveMessageEvent.OWNER_LEFT]: liveMessage.onOwnerLeft,
    [LiveMessageEvent.CHAT]: liveMessage.onChat,
    [LiveMessageEvent.NOTIFICATION]: liveMessage.onNotification,
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
    effects.live.applyClient(moduleShortid, operation);
  } catch (e) {
    // Something went wrong, probably a sync mismatch. Request new version
    console.error(
      'Something went wrong with applying OT operation',
      moduleShortid,
      operation
    );
    effects.live.sendModuleState();
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
      .compose(operation)
      .toJSON();
  } else {
    pendingOperation = operation.toJSON();
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
    const { liveUserId } = state.live;
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
    const { modules } = state.editor.currentSandbox;
    const module = modules.find(m => m.shortid === user.currentModuleShortid);

    actions.editor.moduleSelected({
      id: module ? module.id : undefined,
    });
  }
};

export const onModuleStateMismatch: Action = ({ effects }) => {
  effects.live.sendModuleUpdateRequest();
};
