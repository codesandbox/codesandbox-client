import { Action, AsyncAction, Config } from 'app/overmind';
import { RoomInfo } from '@codesandbox/common/lib/types';
import { IContext } from 'overmind';

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
