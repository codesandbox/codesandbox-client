import { Action, AsyncAction, Config } from 'app/overmind';
import {
  RoomInfo,
  User,
  Module,
  EditorSelection,
} from '@codesandbox/common/lib/types';
import { IContext } from 'overmind';

import { withLoadApp } from 'app/overmind/factories';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import { camelizeKeys } from 'humps';

export const updateSelection: Action<any> = ({ state }, data) => {
  const liveUserId = data.liveUserId;
  const moduleShortid = data.moduleShortid;
  const selection = data.selection;
  const userIndex = state.live.roomInfo.users.findIndex(
    u => u.id === liveUserId
  );

  if (userIndex > -1) {
    state.live.roomInfo.users[userIndex].currentModuleShortid = moduleShortid;
    state.live.roomInfo.users[userIndex].selection = selection;
  }
};

export const sendSelectionToEditor: Action<any> = ({ state }, data) => {
  const userId = data.liveUserId;
  const moduleShortid = data.moduleShortid;
  const selection = data.selection;

  if (
    moduleShortid === state.editor.currentModuleShortid &&
    state.live.isEditor(userId)
  ) {
    const user = state.live.roomInfo.users.find(u => u.id === userId);

    state.editor.pendingUserSelections.push({
      userId,
      name: user.username,
      selection,
      color: user.color.toJS(),
    });
  }
};

export const sendModuleInfo: AsyncAction<{
  event: string;
  type: 'module' | 'directory';
  moduleShortid: string;
  options?: { sendModule: boolean };
}> = async (
  { state, effects },
  { event, type, moduleShortid, options: { sendModule = true } }
) => {
  if (state.live.isCurrentEditor) {
    const message = {
      type,
    };
    if (sendModule) {
      const modules =
        type === 'module'
          ? state.get(`editor.currentSandbox.modules`)
          : state.get(`editor.currentSandbox.directories`);

      message.module = modules.find(m => m.shortid === moduleShortid);
    }

    if (type === 'module') {
      message.moduleShortid = moduleShortid;
    } else {
      message.directoryShortid = moduleShortid;
    }

    if (module) {
      effects.live.send(event, message);
    }
  }
};

export const clearUserSelections: Action<any> = ({ state }, data) => {
  const clearSelections = userId => {
    const userIndex = state.live.roomInfo.users.findIndex(u => u.id === userId);

    if (userIndex > -1) {
      if (state.live.roomInfo.users[userIndex]) {
        state.live.roomInfo.users[userIndex].selection = null;
        state.editor.pendingUserSelections.push({
          userId,
          selection: null,
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
  effects.ot.reset();
};

export const clearUserSelections: Action<any> = ({ state }, data) => {
  const clearSelections = userId => {
    const userIndex = state.live.roomInfo.users.findIndex(u => u.id === userId);

    if (userIndex > -1) {
      if (state.live.roomInfo.users[userIndex]) {
        state.live.roomInfo.users[userIndex].selection = null;
        state.editor.pendingUserSelections.push({
          userId,
          selection: null,
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
  effects.ot.reset();
};

export const disconnect: Action = ({ effects }) => {
  effects.ot.reset();
  effects.live.disconnect();
};

export const sendModuleSaved: Action<string> = ({ actions }, moduleShortid) => {
  actions.live.internal.sendModuleInfo({
    event: 'module:saved',
    type: 'module',
    moduleShortid,
  });
};

export const initialize: AsyncAction = withLoadApp(
  async ({ state, effects, actions }) => {
    state.live.isLoading = true;

    try {
      state.live.roomInfo = await effects.live.joinChannel<RoomInfo>(
        state.editor.currentSandbox.roomId
      );
      effects.analytics.track('Live Session Joined', {});
      effects.live.listen(actions.live.internal.liveMessageReceived);
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
      actions.live.internal.initializeModuleState();
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
    effects.ot.initializeModule(moduleShortid, moduleInfo.revision);

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
        selection: user.selection.toJSON(),
      });
    }
  });

  return selections;
};

export const sendSelection: Action<{
  moduleShortid: string;
  selection: any;
}> = ({ state, effects }, { moduleShortid, selection }) => {
  const liveUserId = state.live.liveUserId;
  const userIndex = state.live.roomInfo.users.findIndex(
    u => u.id === liveUserId
  );

  if (userIndex > -1) {
    if (state.live.roomInfo.users[userIndex]) {
      state.live.roomInfo.users[userIndex].currentModuleShortid = moduleShortid;

      state.live.roomInfo.users[userIndex].selection = selection;

      effects.live.send('user:selection', {
        liveUserId,
        moduleShortid,
        selection,
      });
    }
  }
};

export const getModuleIdFromShortid: Action<string, string> = (
  { state },
  moduleShortid
) => {
  const modules = state.editor.currentSandbox.modules;

  const module = modules.find(m => m.shortid === moduleShortid);

  return module && module.id;
};
