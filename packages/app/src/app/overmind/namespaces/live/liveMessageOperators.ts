import { getModulesAndDirectoriesInDirectory } from '@codesandbox/common/lib/sandbox/modules';
import {
  Directory,
  LiveDisconnectReason,
  LiveMessage,
  LiveUser,
  Module,
  RoomInfo,
  UserSelection,
  UserViewRange,
} from '@codesandbox/common/lib/types';
import { logBreadcrumb } from '@codesandbox/common/lib/utils/analytics/sentry';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import { camelizeKeys } from 'humps';
import { mutate } from 'overmind';

import { Operator } from 'app/overmind';
import { getSavedCode } from 'app/overmind/utils/sandbox';

export const onSave: Operator<LiveMessage<{
  saved_code: string;
  updated_at: string;
  inserted_at: string;
  version: number;
  path: string;
}>> = mutate(({ state, effects }, { data }) => {
  const sandbox = state.editor.currentSandbox;

  if (!sandbox) {
    return;
  }
  const module = sandbox.modules.find(
    moduleItem => moduleItem.path === data.path
  );

  if (!module) {
    return;
  }

  module.savedCode = module.code === data.saved_code ? null : data.saved_code;
  module.updatedAt = data.updated_at;
  module.insertedAt = data.inserted_at;
  sandbox.version = data.version;
  effects.vscode.sandboxFsSync.writeFile(state.editor.modulesByPath, module);

  if (module.savedCode === null) {
    effects.vscode.syncModule(module);
  }
});

export const onJoin: Operator<LiveMessage<{
  status: 'connected';
  live_user_id: string;
}>> = mutate(({ effects, actions, state }, { data }) => {
  state.live.liveUserId = data.live_user_id;

  if (state.live.reconnecting) {
    // We reconnected!
    effects.live.getAllClients().forEach(client => {
      client.serverReconnect();
    });

    if (state.live.roomInfo) {
      // Clear all user selections
      actions.live.internal.clearUserSelections(null);
    }
  }

  state.live.reconnecting = false;
});

export const onModuleState: Operator<LiveMessage<{
  module_state: any;
}>> = mutate(({ state, actions }, { data }) => {
  actions.live.internal.initializeModuleState(data.module_state);
});

export const onExternalResources: Operator<LiveMessage<{
  externalResources: string[];
}>> = mutate(({ state, actions }, { data }) => {
  if (!state.editor.currentSandbox) {
    return;
  }
  state.editor.currentSandbox.externalResources = data.externalResources;
  actions.editor.internal.updatePreviewCode();
});

export const onUsersChanged: Operator<LiveMessage<{
  users: LiveUser[];
  editor_ids: string[];
  owner_ids: string[];
}>> = mutate(({ state, actions }, { data }) => {
  if (state.live.isLoading || !state.live.roomInfo || !state.live.isLive) {
    return;
  }

  const users = camelizeKeys(data.users);

  state.live.roomInfo.users = users as LiveUser[];
  state.live.roomInfo.editorIds = data.editor_ids;
  state.live.roomInfo.ownerIds = data.owner_ids;

  if (state.editor.currentModule) {
    actions.editor.internal.updateSelectionsOfModule({
      module: state.editor.currentModule,
    });
  }
});

export const onUserEntered: Operator<LiveMessage<{
  users: LiveUser[];
  editor_ids: string[];
  owner_ids: string[];
  joined_user_id: string;
}>> = mutate(({ state, effects, actions }, { data }) => {
  if (state.live.isLoading || !state.live.roomInfo || !state.live.isLive) {
    return;
  }

  const users = camelizeKeys(data.users);

  state.live.roomInfo.users = users as LiveUser[];
  state.live.roomInfo.editorIds = data.editor_ids;
  state.live.roomInfo.ownerIds = data.owner_ids;

  if (state.editor.currentModule) {
    actions.editor.internal.updateSelectionsOfModule({
      module: state.editor.currentModule,
    });
  }

  // Send our own selections and viewranges to everyone, just to let the others know where
  // we are
  actions.live.sendCurrentSelection();
  actions.live.sendCurrentViewRange();

  if (data.joined_user_id === state.live.liveUserId) {
    return;
  }

  const user = data.users.find(u => u.id === data.joined_user_id);

  if (
    !state.live.notificationsHidden &&
    user &&
    !state.user?.experiments.collaborator
  ) {
    effects.notificationToast.add({
      message: `${user.username} joined the live session.`,
      status: NotificationStatus.NOTICE,
    });
  }
});

export const onUserLeft: Operator<LiveMessage<{
  users: LiveUser[];
  left_user_id: string;
  editor_ids: string[];
  owner_ids: string[];
}>> = mutate(({ state, actions, effects }, { data }) => {
  if (!state.live.roomInfo) {
    return;
  }

  if (!state.live.notificationsHidden) {
    const { users } = state.live.roomInfo;
    const user = users ? users.find(u => u.id === data.left_user_id) : null;

    if (
      user &&
      user.id !== state.live.liveUserId &&
      !state.user?.experiments.collaborator
    ) {
      effects.notificationToast.add({
        message: `${user.username} left the live session.`,
        status: NotificationStatus.NOTICE,
      });
    }
  }

  actions.live.onUserLeft({ liveUserId: data.left_user_id });

  const users = camelizeKeys(data.users) as LiveUser[];

  state.live.roomInfo.users = users;
  state.live.roomInfo.ownerIds = data.owner_ids;
  state.live.roomInfo.editorIds = data.editor_ids;
});

export const onModuleSaved: Operator<LiveMessage<{
  moduleShortid: string;
  module: Module;
}>> = mutate(({ state, effects, actions }, { _isOwnMessage, data }) => {
  if (_isOwnMessage || !state.editor.currentSandbox) {
    return;
  }
  const module = state.editor.currentSandbox.modules.find(
    moduleItem => moduleItem.shortid === data.moduleShortid
  );

  if (module) {
    actions.editor.internal.setModuleSavedCode({
      moduleShortid: data.moduleShortid,
      savedCode: data.module.savedCode,
    });

    effects.vscode.sandboxFsSync.writeFile(state.editor.modulesByPath, module);
    const savedCode = getSavedCode(module.code, module.savedCode);
    if (!effects.vscode.isModuleOpened(module)) {
      module.code = savedCode;
    }
    if (module.code === savedCode) {
      // We revert the module so that VSCode will flag saved indication correctly
      effects.vscode.syncModule(module);
    }
    actions.editor.internal.updatePreviewCode();
  }
});

export const onModuleCreated: Operator<LiveMessage<{
  module: Module;
}>> = mutate(({ state, actions, effects }, { _isOwnMessage, data }) => {
  if (_isOwnMessage || !state.editor.currentSandbox) {
    return;
  }
  state.editor.currentSandbox.modules.push(data.module);
  effects.vscode.sandboxFsSync.writeFile(
    state.editor.modulesByPath,
    data.module
  );
  if (state.editor.currentSandbox.originalGit) {
    actions.git.updateGitChanges();
  }
});

export const onModuleMassCreated: Operator<LiveMessage<{
  modules: Module[];
  directories: Directory[];
}>> = mutate(({ state, actions, effects }, { _isOwnMessage, data }) => {
  if (_isOwnMessage || !state.editor.currentSandbox) {
    return;
  }
  state.editor.currentSandbox.modules = state.editor.currentSandbox.modules.concat(
    data.modules
  );
  state.editor.currentSandbox.directories = state.editor.currentSandbox.directories.concat(
    data.directories
  );

  state.editor.modulesByPath = effects.vscode.sandboxFsSync.create(
    state.editor.currentSandbox
  );

  actions.editor.internal.updatePreviewCode();
  if (state.editor.currentSandbox.originalGit) {
    actions.git.updateGitChanges();
  }
});

export const onModuleUpdated: Operator<LiveMessage<{
  moduleShortid: string;
  module: Module;
}>> = mutate(({ state, actions, effects }, { _isOwnMessage, data }) => {
  const sandbox = state.editor.currentSandbox;

  if (_isOwnMessage || !sandbox) {
    return;
  }

  const moduleIndex = sandbox.modules.findIndex(
    moduleEntry => moduleEntry.shortid === data.moduleShortid
  );
  const existingModule =
    state.editor.sandboxes[sandbox.id].modules[moduleIndex];

  if (existingModule.path !== data.module.path) {
    effects.vscode.sandboxFsSync.rename(
      state.editor.modulesByPath,
      existingModule.path!,
      data.module.path!
    );
  }

  Object.assign(existingModule, data.module);

  effects.vscode.sandboxFsSync.writeFile(
    state.editor.modulesByPath,
    existingModule
  );

  if (state.editor.currentModuleShortid === data.moduleShortid) {
    effects.vscode.openModule(existingModule);
  }

  actions.editor.internal.updatePreviewCode();
  if (state.editor.currentSandbox!.originalGit) {
    actions.git.updateGitChanges();
  }
});

export const onModuleDeleted: Operator<LiveMessage<{
  moduleShortid: string;
}>> = mutate(({ state, effects, actions }, { _isOwnMessage, data }) => {
  if (_isOwnMessage || !state.editor.currentSandbox) {
    return;
  }
  const removedModule = state.editor.currentSandbox.modules.find(
    directory => directory.shortid === data.moduleShortid
  );
  if (!removedModule) {
    return;
  }
  const moduleIndex = state.editor.currentSandbox.modules.indexOf(
    removedModule
  );
  const wasCurrentModule =
    state.editor.currentModuleShortid === data.moduleShortid;

  state.editor.currentSandbox.modules.splice(moduleIndex, 1);
  effects.vscode.sandboxFsSync.unlink(
    state.editor.modulesByPath,
    removedModule
  );

  if (wasCurrentModule && state.editor.mainModule) {
    actions.editor.internal.setCurrentModule(state.editor.mainModule);
  }

  actions.editor.internal.updatePreviewCode();
  if (state.editor.currentSandbox.originalGit) {
    actions.git.updateGitChanges();
  }
});

export const onDirectoryCreated: Operator<LiveMessage<{
  module: Directory; // This is very weird?
}>> = mutate(({ state, effects }, { _isOwnMessage, data }) => {
  if (_isOwnMessage || !state.editor.currentSandbox) {
    return;
  }
  // Should this not be a directory?
  state.editor.currentSandbox.directories.push(data.module);
  effects.vscode.sandboxFsSync.mkdir(state.editor.modulesByPath, data.module);
});

export const onDirectoryUpdated: Operator<LiveMessage<{
  directoryShortid: string;
  module: Directory; // Still very weird
}>> = mutate(({ state, actions, effects }, { _isOwnMessage, data }) => {
  const sandbox = state.editor.currentSandbox;
  if (_isOwnMessage || !sandbox) {
    return;
  }

  const directoryIndex = sandbox.directories.findIndex(
    directoryEntry => directoryEntry.shortid === data.directoryShortid
  );
  const existingDirectory =
    state.editor.sandboxes[sandbox.id].directories[directoryIndex];
  const hasChangedPath = existingDirectory.path !== data.module.path;

  Object.assign(existingDirectory, data.module);

  if (hasChangedPath) {
    const prevCurrentModulePath = state.editor.currentModule.path;

    actions.files.internal.renameDirectoryInState({
      directory: existingDirectory,
      sandbox,
      title: data.module.title,
    });

    actions.editor.internal.updatePreviewCode();

    if (prevCurrentModulePath !== state.editor.currentModule.path) {
      actions.editor.internal.setCurrentModule(state.editor.currentModule);
    }
  }
});

export const onDirectoryDeleted: Operator<LiveMessage<{
  directoryShortid: string;
}>> = mutate(({ state, effects, actions }, { _isOwnMessage, data }) => {
  const sandbox = state.editor.currentSandbox;
  if (_isOwnMessage || !sandbox) {
    return;
  }

  const directory = sandbox.directories.find(
    directoryItem => directoryItem.shortid === data.directoryShortid
  );

  if (!directory) {
    return;
  }

  const removedDirectory = sandbox.directories.splice(
    sandbox.directories.indexOf(directory),
    1
  )[0];
  const {
    removedModules,
    removedDirectories,
  } = getModulesAndDirectoriesInDirectory(
    removedDirectory,
    sandbox.modules,
    sandbox.directories
  );

  removedModules.forEach(removedModule => {
    effects.vscode.sandboxFsSync.unlink(
      state.editor.modulesByPath,
      removedModule
    );
    sandbox.modules.splice(sandbox.modules.indexOf(removedModule), 1);
  });

  removedDirectories.forEach(removedDirectoryItem => {
    sandbox.directories.splice(
      sandbox.directories.indexOf(removedDirectoryItem),
      1
    );
  });

  // We open the main module as we do not really know if you had opened
  // any nested file of this directory. It would require complex logic
  // to figure that out. This concept is soon removed anyways
  if (state.editor.mainModule)
    effects.vscode.openModule(state.editor.mainModule);
  actions.editor.internal.updatePreviewCode();

  if (state.editor.currentSandbox!.originalGit) {
    actions.git.updateGitChanges();
  }
});

export const onUserSelection: Operator<LiveMessage<{
  liveUserId: string;
  moduleShortid: string;
  selection: UserSelection;
}>> = mutate(({ state, effects, actions }, { _isOwnMessage, data }) => {
  if (_isOwnMessage || !state.live.roomInfo || !state.editor.currentSandbox) {
    return;
  }

  const userSelectionLiveUserId = data.liveUserId;
  const { moduleShortid } = data;
  const { selection } = data;
  const userIndex = state.live.roomInfo.users.findIndex(
    u => u.id === userSelectionLiveUserId
  );

  if (userIndex > -1) {
    state.live.roomInfo.users[userIndex].currentModuleShortid = moduleShortid;
    state.live.roomInfo.users[userIndex].selection = selection;
  }

  const module = state.editor.currentSandbox.modules.find(
    m => m.shortid === moduleShortid
  );

  const isFollowingUser =
    state.live.followingUserId === userSelectionLiveUserId;
  if (
    module &&
    (state.live.isEditor(userSelectionLiveUserId) || isFollowingUser)
  ) {
    const user = state.live.roomInfo.users.find(
      u => u.id === userSelectionLiveUserId
    );

    if (user) {
      effects.vscode.updateUserSelections(
        module,
        actions.live.internal.getSelectionsForModule(module)
      );

      if (isFollowingUser) {
        actions.live.revealCursorPosition({
          liveUserId: userSelectionLiveUserId,
        });
      }
    }
  }
});

export const onUserCurrentModule: Operator<LiveMessage<{
  live_user_id: string;
  moduleShortid: string;
}>> = mutate(({ state, actions }, { _isOwnMessage, data }) => {
  if (_isOwnMessage || !state.live.roomInfo || !state.editor.currentSandbox) {
    return;
  }
  const userIndex = state.live.roomInfo.users.findIndex(
    u => u.id === data.live_user_id
  );

  if (userIndex > -1) {
    state.live.roomInfo.users[userIndex].currentModuleShortid =
      data.moduleShortid;
  }

  actions.live.internal.clearUserSelections(data.live_user_id);

  if (
    state.live.followingUserId === data.live_user_id &&
    data.moduleShortid !== state.editor.currentModuleShortid
  ) {
    const { moduleShortid } = data;
    const { modules } = state.editor.currentSandbox;
    const module = modules.find(m => m.shortid === moduleShortid);

    if (!module) {
      return;
    }

    actions.editor.moduleSelected({
      id: module.id,
    });
  }
});

export const onUserViewRange: Operator<LiveMessage<{
  liveUserId: string;
  moduleShortid: string;
  viewRange: UserViewRange;
}>> = mutate(({ state, effects, actions }, { _isOwnMessage, data }) => {
  if (_isOwnMessage || !state.live.roomInfo || !state.editor.currentSandbox) {
    return;
  }

  const userSelectionLiveUserId = data.liveUserId;
  const { moduleShortid } = data;
  const { viewRange } = data;
  const userIndex = state.live.roomInfo.users.findIndex(
    u => u.id === userSelectionLiveUserId
  );

  if (userIndex !== -1) {
    state.live.roomInfo.users[userIndex].currentModuleShortid = moduleShortid;
    state.live.roomInfo.users[userIndex].viewRange = viewRange;
  }

  const module = state.editor.currentSandbox.modules.find(
    m => m.shortid === moduleShortid
  );
  if (module) {
    const user = state.live.roomInfo.users.find(
      u => u.id === userSelectionLiveUserId
    );

    if (user && state.live.followingUserId === userSelectionLiveUserId) {
      effects.vscode.revealRange(viewRange);
    }
  }
});

export const onLiveMode: Operator<LiveMessage<{
  mode: RoomInfo['mode'];
}>> = mutate(({ actions, state }, { _isOwnMessage, data }) => {
  if (!state.live.roomInfo) {
    return;
  }

  if (!_isOwnMessage) {
    state.live.roomInfo.mode = data.mode;
  }
  actions.live.internal.clearUserSelections(null);
});

export const onLiveChatEnabled: Operator<LiveMessage<{
  enabled: boolean;
}>> = mutate(({ state }, { _isOwnMessage, data }) => {
  if (!state.live.roomInfo) {
    return;
  }

  if (_isOwnMessage) {
    return;
  }
  state.live.roomInfo.chatEnabled = data.enabled;
});

export const onLiveAddEditor: Operator<LiveMessage<{
  editor_user_id: string;
}>> = mutate(({ state }, { _isOwnMessage, data }) => {
  if (!state.live.roomInfo) {
    return;
  }

  if (!_isOwnMessage) {
    state.live.roomInfo.editorIds.push(data.editor_user_id);
  }
});

export const onLiveRemoveEditor: Operator<LiveMessage<{
  editor_user_id: string;
}>> = mutate(({ state, actions }, { _isOwnMessage, data }) => {
  if (!state.live.roomInfo) {
    return;
  }

  const userId = data.editor_user_id;
  actions.live.internal.clearUserSelections(userId);

  if (!_isOwnMessage) {
    const editors = state.live.roomInfo.editorIds;
    const newEditors = editors.filter(id => id !== userId);

    state.live.roomInfo.editorIds = newEditors;
  }
});

export const onOperation: Operator<LiveMessage<{
  module_shortid: string;
  operation: any;
}>> = mutate(({ state, effects, actions }, { _isOwnMessage, data }) => {
  if (state.live.isLoading) {
    return;
  }
  if (_isOwnMessage) {
    // Do nothing since we already sent this operation
  } else {
    try {
      effects.live.applyServer(data.module_shortid, data.operation);
    } catch (e) {
      // Something went wrong, probably a sync mismatch. Request new version
      console.error('Something went wrong with applying OT operation');

      logBreadcrumb({
        category: 'ot',
        message: `Apply operation from server to OT client failed ${JSON.stringify(
          data
        )}`,
      });

      effects.live.sendModuleStateSyncRequest();
    }
  }
});

export const onConnectionLoss: Operator<LiveMessage> = mutate(
  async ({ state, effects }) => {
    if (!state.live.reconnecting) {
      let notificationId: string | null = null;
      const timeout = setTimeout(() => {
        notificationId = effects.notificationToast.add({
          message: 'We lost connection with the live server, reconnecting...',
          status: NotificationStatus.ERROR,
        });
      }, 30000);

      state.live.reconnecting = true;

      await effects.flows.waitUntil(s => s.live.reconnecting === false);
      if (notificationId) {
        effects.notificationToast.remove(notificationId);
      }
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }
);

export const onDisconnect: Operator<LiveMessage<{
  reason: LiveDisconnectReason;
}>> = mutate(({ state, actions }, { data }) => {
  actions.live.internal.disconnect();

  if (state.editor.currentSandbox)
    state.editor.currentSandbox.owned = state.live.isOwner;

  actions.modalOpened({
    modal: 'liveSessionEnded',
    message:
      data.reason === 'close'
        ? 'The owner ended the session'
        : 'The session has ended due to inactivity',
  });

  actions.live.internal.reset();
});

export const onOwnerLeft: Operator<LiveMessage> = mutate(({ actions }) => {
  actions.modalOpened({
    modal: 'liveSessionEnded',
    message: 'The owner left the session',
  });
});

export const onChat: Operator<LiveMessage<{
  live_user_id: string;
  message: string;
  date: number;
}>> = mutate(({ state }, { data }) => {
  if (!state.live.roomInfo) {
    return;
  }

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
});

export const onNotification: Operator<LiveMessage<{
  message: string;
  type: NotificationStatus;
}>> = mutate(({ effects }, { data }) => {
  effects.notificationToast.add({
    message: data.message,
    status: data.type,
  });
});
