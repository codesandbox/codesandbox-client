import {
  EditorSelection,
  Module,
  Sandbox,
} from '@codesandbox/common/lib/types';
import { logBreadcrumb } from '@codesandbox/common/lib/utils/analytics/sentry';
import { Action, AsyncAction } from 'app/overmind';
import { json } from 'overmind';

import { getSavedCode } from '../../utils/sandbox';
import { IModuleStateModule } from './types';

export const clearUserSelections: Action<string | null> = (
  { state, effects },
  live_user_id
) => {
  if (!state.live.roomInfo) {
    return;
  }

  const clearSelections = (userId: string) => {
    const roomInfo = state.live.roomInfo!;
    const userIndex = roomInfo.users.findIndex(u => u.id === userId);

    effects.vscode.clearUserSelections(userId);
    if (userIndex > -1) {
      const user = roomInfo.users[userIndex];
      if (user) {
        user.selection = null;
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
  state.live.joinSource = 'sandbox';
  effects.live.reset();
};

export const disconnect: Action = ({ effects, actions }) => {
  effects.live.disconnect();
  actions.live.internal.reset();
};

export const initialize: AsyncAction<string, Sandbox | null> = async (
  { state, effects, actions },
  id
) => {
  state.live.isLoading = true;

  try {
    const { roomInfo, liveUserId } = await effects.live.joinChannel(id);

    state.live.roomInfo = roomInfo;
    state.live.liveUserId = liveUserId;

    const sandboxId = roomInfo.sandboxId;

    let sandbox = state.editor.currentSandbox;
    if (!sandbox || sandbox.id !== sandboxId) {
      sandbox = await effects.api.getSandbox(sandboxId);
      state.editor.sandboxes[sandboxId] = sandbox;
      state.editor.currentId = sandboxId;
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

interface IModuleState {
  [moduleId: string]: IModuleStateModule;
}

export const initializeModuleState: Action<IModuleState> = (
  { state, actions, effects },
  moduleState
) => {
  const sandbox = state.editor.currentSandbox;
  if (!sandbox) {
    return;
  }
  logBreadcrumb({
    category: 'ot',
    message: 'Applying new module state',
  });
  Object.keys(moduleState).forEach(moduleShortid => {
    const moduleInfo = moduleState[moduleShortid];
    effects.live.createClient(moduleShortid, moduleInfo.revision || 0);

    // Module has not been saved, so is different
    const module = sandbox.modules.find(m => m.shortid === moduleShortid);

    if (module) {
      if (!('code' in moduleInfo)) {
        return;
      }

      const savedCodeChanged =
        getSavedCode(moduleInfo.code, moduleInfo.saved_code) !==
        getSavedCode(module.code, module.savedCode);
      const moduleChanged =
        moduleInfo.code !== module.code ||
        moduleInfo.saved_code !== module.savedCode;

      if (moduleChanged) {
        if (moduleInfo.saved_code !== undefined) {
          module.savedCode = moduleInfo.saved_code;
        }
        if (moduleInfo.code !== undefined) {
          module.code = moduleInfo.code;
        }

        if (savedCodeChanged) {
          effects.vscode.sandboxFsSync.writeFile(
            state.editor.modulesByPath,
            module
          );
        }
        if (moduleInfo.synced) {
          effects.vscode.syncModule(module);
        } else {
          effects.vscode.setModuleCode(module);
        }
      }
    }
  });
  actions.editor.internal.updatePreviewCode();
};

export const getSelectionsForModule: Action<Module, EditorSelection[]> = (
  { state },
  module
) => {
  const selections: EditorSelection[] = [];
  const moduleShortid = module.shortid;

  if (!state.live.roomInfo) {
    return selections;
  }

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
