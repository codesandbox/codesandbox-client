import { Action, AsyncAction } from 'app/overmind';
import {
  RoomInfo,
  Module,
  EditorSelection,
} from '@codesandbox/common/lib/types';
import { withLoadApp } from 'app/overmind/factories';
import { json } from 'overmind';

export const clearUserSelections: Action<any> = ({ state }, data) => {
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

  if (!data) {
    // All users
    state.live.roomInfo.users.forEach(u => clearSelections(u.id));
  } else {
    clearSelections(data.live_user_id);
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

export const sendModuleSaved: Action<string> = ({ effects }, moduleShortid) => {
  effects.live.sendModuleSaved(moduleShortid);
};

export const initialize: AsyncAction = withLoadApp(
  async ({ state, effects, actions }) => {
    state.live.isLoading = true;

    try {
      state.live.roomInfo = await effects.live.joinChannel<RoomInfo>(
        state.editor.currentSandbox.roomId
      );
      effects.analytics.track('Live Session Joined', {});
      effects.live.listen(actions.live.liveMessageReceived);
      /* 
      set(state`live.liveUserId`, props`liveUserId`),
      set(state`editor.currentId`, props`sandbox.id`),
      when(state`editor.currentSandbox`),
      {
        true: [],
        false: [
          set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
        ],
      },
    */
      state.live.receivingCode = true; // Not necessary as next step is synchronous
      // TODO: Where is the module state?
      // actions.live.internal.initializeModuleState();
      state.live.receivingCode = false;
      state.live.isLive = true;
      state.live.error = null;
      effects.live.send('live:module_state', {});
    } catch (error) {
      state.live.error = error.reason;
    }
  }
);

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
        color: user.color.toJS(),
        name: user.username,
        selection: json(user.selection),
      });
    }
  });

  return selections;
};
