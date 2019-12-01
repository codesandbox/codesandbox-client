import { LiveMessage, LiveMessageEvent } from '@codesandbox/common/lib/types';
import { Action, AsyncAction, Operator } from 'app/overmind';
import { withLoadApp } from 'app/overmind/factories';
import getItems from 'app/overmind/utils/items';
import { filter, fork, pipe } from 'overmind';

import * as internalActions from './internalActions';
import * as liveMessage from './liveMessageOperators';

export const internal = internalActions;

export const roomJoined: AsyncAction<{
  roomId: string;
}> = withLoadApp(async ({ state, effects, actions }, { roomId }) => {
  await effects.vscode.initialize;
  await effects.vscode.closeAllTabs();
  const sandbox = await actions.live.internal.initialize(roomId);

  if (state.updateStatus === 'available') {
    const modal = 'liveVersionMismatch';
    effects.analytics.track('Open Modal', { modal });
    state.currentModal = modal;
  }

  await actions.internal.setCurrentSandbox(sandbox);

  const items = getItems(state);
  const defaultItem = items.find(i => i.defaultOpen) || items[0];

  state.workspace.openedWorkspaceItem = defaultItem.id;

  await effects.vscode.changeSandbox(state.editor.currentSandbox, fs => {
    state.editor.modulesByPath = fs;
  });

  effects.live.sendModuleState();

  effects.vscode.openModule(state.editor.currentModule);
  effects.preview.executeCodeImmediately({ initialRender: true });
  state.live.isLoading = false;
});

export const createLiveClicked: AsyncAction<{
  sandboxId: string;
}> = async ({ state, effects, actions }, { sandboxId }) => {
  effects.analytics.track('Create Live Session');

  const roomId = await effects.api.createLiveRoom(sandboxId);
  const sandbox = await actions.live.internal.initialize(roomId);

  Object.assign(sandbox, {
    modules: sandbox.modules.map(module => ({
      ...module,
      code: state.editor.currentSandbox.modules.find(
        currentSandboxModule => currentSandboxModule.shortid === module.shortid
      ).code,
    })),
  });

  Object.assign(state.editor.sandboxes[state.editor.currentId], sandbox);
  state.editor.modulesByPath = effects.vscode.sandboxFsSync.create(sandbox);

  effects.live.sendModuleState();
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

export const applyTransformation: AsyncAction<{
  operation: any;
  moduleShortid: string;
}> = async ({ effects }, { operation, moduleShortid }) => {
  try {
    await effects.vscode.applyOperation(moduleShortid, operation);
  } catch (error) {
    // Do not care about the error, but something went wrong and we
    // need a full sync
    effects.live.sendModuleState();
  }
};

export const onSelectionChanged: Action<any> = (
  { state, effects },
  selection
) => {
  if (state.live.isCurrentEditor) {
    const { liveUserId } = state.live;
    const moduleShortid = state.editor.currentModuleShortid;
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
