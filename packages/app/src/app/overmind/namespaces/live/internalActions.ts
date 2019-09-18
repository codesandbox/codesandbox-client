import { Action, AsyncAction } from 'app/overmind';
import {
  Module,
  EditorSelection,
  Sandbox,
} from '@codesandbox/common/lib/types';
import { json } from 'overmind';

export const clearUserSelections: Action<any> = ({ state }, live_user_id) => {
  const clearSelections = userId => {
    const userIndex = state.live.roomInfo.users.findIndex(u => u.id === userId);

    if (userIndex > -1) {
      if (state.live.roomInfo.users[userIndex]) {
        state.live.roomInfo.users[userIndex].selection = null;
        state.editor.pendingUserSelections.push({
          userId,
          selection: null,
          name: null,
          color: null,
        });
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
    const {
      roomInfo,
      liveUserId,
      sandbox,
      moduleState,
    } = await effects.live.joinChannel(id);

    state.live.roomInfo = roomInfo;
    state.live.liveUserId = liveUserId;

    if (!state.editor.sandboxes[sandbox.id]) {
      state.editor.sandboxes[sandbox.id] = sandbox;
    }
    state.editor.currentId = sandbox.id;

    effects.analytics.track('Live Session Joined', {});
    effects.live.listen(actions.live.liveMessageReceived);

    state.live.receivingCode = true;
    actions.live.internal.initializeModuleState(moduleState);
    state.live.receivingCode = false;
    state.live.isLive = true;
    state.live.error = null;
    effects.live.sendModuleState();

    return sandbox;
  } catch (error) {
    state.live.error = error.reason;
  } finally {
    state.live.isLoading = false;
  }

  return null;
};

export const initializeModuleState: Action<any> = (
  { state, effects },
  moduleState
) => {
  Object.keys(moduleState).forEach(moduleShortid => {
    const moduleInfo = moduleState[moduleShortid];
    effects.live.createClient(moduleShortid, moduleInfo.revision);

    // Module has not been saved, so is different
    const index = state.editor.currentSandbox.modules.findIndex(
      m => m.shortid === moduleShortid
    );

    if (index > -1) {
      if (moduleInfo.code != null) {
        state.editor.currentSandbox.modules[index].code = moduleInfo.code;
      }
      if (!moduleInfo.synced) {
        state.editor.changedModuleShortids.push(moduleShortid);
      }
    }
  });
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
