// Little hack for circular dependency problem
import { set } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';

import * as factories from '../../factories';
import * as actions from './actions';

export const initializeLive = factories.withLoadApp([
  set(state`live.isLoading`, true),
  factories.track('Live Session Joined', {}),
  actions.joinChannel,
  {
    success: [
      set(props`listenSignalPath`, 'live.liveMessageReceived'),
      actions.initializeLiveState,
      actions.listen,
    ],
    error: set(state`live.error`, props`reason`),
  },
]);
