import {
  EditorSelection,
  Module,
  Sandbox,
} from '@codesandbox/common/lib/types';
import { Action, AsyncAction } from 'app/overmind';
import { json } from 'overmind';

export const clearUserSelections: Action<any> = (
  { state, effects },
  live_user_id
) => {
  const clearSelections = userId => {
    const userIndex = state.live.roomInfo.users.findIndex(u => u.id === userId);

    if (userIndex > -1) {
      if (state.live.roomInfo.users[userIndex]) {
        state.live.roomInfo.users[userIndex].selection = null;
        effects.vscode.updateUserSelections([
          {
            userId,
            selection: null,
            name: null,
            color: null,
          },
        ]);
      }
    }
  };

  if (!live_user_id) {
    // All users
    state.live.roomInfo.users.forEach(u => clearSelections(u.id));
  } else {
    clearSelections(live_user_id);
  }
};

export const reset: Action = ({ state, actions, effects }) => {
  actions.live.internal.clearUserSelections(null);
  state.live.isLive = false;
  state.live.error = null;
  state.live.isLoading = false;
  state.live.roomInfo = null;
  effects.live.resetClients();
};

export const disconnect: Action = ({ effects }) => {
  effects.live.resetClients();
  effects.live.disconnect();
};

export const initialize: AsyncAction<string, Sandbox> = async (
  { state, effects, actions },
  id
) => {
  state.live.isLoading = true;

  try {
    const { roomInfo, liveUserId, sandbox } = await effects.live.joinChannel(
      id
    );

    state.live.roomInfo = roomInfo;
    state.live.liveUserId = liveUserId;

    if (
      !state.editor.currentSandbox ||
      state.editor.currentSandbox.id !== sandbox.id
    ) {
      state.editor.sandboxes[sandbox.id] = sandbox;
      state.editor.currentId = sandbox.id;
    }

    effects.analytics.track('Live Session Joined', {});
    effects.live.listen(actions.live.liveMessageReceived);

    state.live.isLive = true;
    state.live.error = null;

    return sandbox;
  } catch (error) {
    state.live.error = error.reason;
  } finally {
    state.live.isLoading = false;
  }

  return null;
};

export const initializeModuleState: Action<any> = (
  { state, actions, effects },
  moduleState
) => {
  Object.keys(moduleState).forEach(moduleShortid => {
    const moduleInfo = moduleState[moduleShortid];
    effects.live.createClient(moduleShortid, moduleInfo.revision);

    // Module has not been saved, so is different
    const module = state.editor.currentSandbox.modules.find(
      m => m.shortid === moduleShortid
    );

    if (module) {
      if (moduleInfo.code === null) {
        return;
      }
      module.savedCode = moduleInfo.save_code;
      module.code = moduleInfo.code;

      effects.vscode.setModuleCode(module);

      if (moduleInfo.synced) {
        effects.vscode.sandboxFsSync.writeFile(
          state.editor.modulesByPath,
          module
        );
      }
    }
  });
  actions.editor.internal.updatePreviewCode();
};

export const getSelectionsForModule: Action<Module, EditorSelection[]> = (
  { state },
  module
) => {
  const selections = [];
  const moduleShortid = module.shortid;

  state.live.roomInfo.users.forEach(user => {
    const userId = user.id;
    if (
      userId === state.live.liveUserId ||
      user.currentModuleShortid !== moduleShortid ||
      !state.live.isEditor(userId)
    ) {
      return;
    }

    if (user.selection) {
      selections.push({
        userId,
        color: user.color,
        name: user.username,
        selection: json(user.selection),
      });
    }
  });

  return selections;
};
