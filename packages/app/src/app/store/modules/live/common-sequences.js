// Little hack for circular dependency problem
import { set } from 'cerebral/operators';
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
      set(state`live.isLive`, true),
      set(state`live.error`, null),
    ],
    error: set(state`live.error`, props`reason`),
  },
]);
