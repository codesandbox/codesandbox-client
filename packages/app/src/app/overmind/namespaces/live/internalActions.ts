import { Action, AsyncAction, Config } from 'app/overmind';
import { RoomInfo } from '@codesandbox/common/lib/types';
import { IContext } from 'overmind';
import { getTextOperation } from '@codesandbox/common/lib/utils/diff';

function sendModuleInfo(
  { state, effects }: IContext<Config>,
  event: string,
  type: 'module' | 'directory',
  moduleShortid,
  { sendModule = true } = {}
) {
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
}

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

export const sendModuleSaved: Action<string> = (context, moduleShortid) => {
  sendModuleInfo(context, 'module:saved', 'module', moduleShortid);
};

export const initialize: AsyncAction = async ({ state, effects, actions }) => {
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
};

export const liveMessageReceived: Action = () => {};

export const initializeModuleState: Action = ({ state, effects }) => {
  const moduleState = state.live.roomInfo.moduleState || {};

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

export const getCodeOperation: Action<
  {
    moduleShortid: string;
    code: string;
  },
  any
> = ({ state }, { moduleShortid, code }) => {
  if (!state.live.isLive) {
    return null;
  }

  const module = state.editor.currentSandbox.modules.find(
    m => m.shortid === moduleShortid
  );

  if (!module || module.code === code) {
    return {};
  }

  const oldCode = module.code;

  return getTextOperation(oldCode, code);
};

export const sendTransform: Action<{
  operation: any;
  moduleShortid: string;
}> = ({ effects }, { operation, moduleShortid }) => {
  if (!operation) {
    return;
  }

  try {
    effects.ot.applyClient(moduleShortid, operation);
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

export const getSelectionsForCurrentModule: Action<void, any> = ({ state }) => {
  const selections = [];
  const moduleShortid = state.editor.currentModuleShortid;

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

export const sendChangeCurrentModule: Action<string> = (
  { state, effects },
  id
) => {
  const module = state.editor.currentSandbox.modules.find(m => m.id === id);

  const userIndex = state.live.roomInfo.users.findIndex(
    u => u.id === state.live.liveUserId
  );

  if (userIndex > -1) {
    state.live.roomInfo.users[userIndex].currentModuleShortid = module.shortid;

    const followingUserId = state.live.followingUserId;

    if (followingUserId) {
      const followingUserIndex = state.live.roomInfo.users.findIndex(
        u => u.id === followingUserId
      );

      if (followingUserIndex > -1) {
        const user = state.live.roomInfo.users[followingUserIndex];

        if (user && user.currentModuleShortid !== module.shortid) {
          // Reset following as this is a user change module action
          state.live.followingUserId = null;
        }
      }
    }

    effects.live.send('user:current-module', {
      moduleShortid: module.shortid,
    });
  }
};
