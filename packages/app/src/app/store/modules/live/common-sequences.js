// Little hack for circular dependency problem
import { set, when } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';

import * as factories from '../../factories';
import * as actions from './actions';

export const initializeLive = factories.withLoadApp([
  set(state`live.isLoading`, true),

  actions.joinChannel,
  {
    success: [
      factories.track('Live Session Joined', {}),
      set(props`listenSignalPath`, 'live.liveMessageReceived'),
      actions.listen,

      set(state`live.roomInfo`, props`roomInfo`),
      set(state`live.liveUserId`, props`liveUserId`),
      set(state`editor.currentId`, props`sandbox.id`),
      when(state`editor.currentSandbox`),
      {
        true: [],
        false: [
          set(state`editor.sandboxes.${props`sandbox.id`}`, props`sandbox`),
        ],
      },
      actions.setReceivingStatus,
      actions.initializeModuleState,
      actions.unSetReceivingStatus,
      set(state`live.isLive`, true),
      set(state`live.error`, null),

      // We do an extra manual sync of modules because in the time that the user joined there is a chance
      // that new messages came in
      actions.syncModuleState,
    ],
    error: set(state`live.error`, props`reason`),
  },
]);
