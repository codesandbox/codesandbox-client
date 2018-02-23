import { set } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import { addNotification } from '../../factories';
import * as actions from './actions';
import { getZeitUserDetails } from '../../sequences';

export const openDeployModal = [
  set(state`currentModal`, 'deployment'),
  getZeitUserDetails,
];

export const deploy = [
  set(state`deployment.deploying`, true),
  actions.createZip,
  actions.loadZip,
  actions.createApiData,
  actions.postToZeit,
  {
    success: [
      set(state`deployment.url`, props`url`),
      set(state`deployment.deploying`, false),
    ],
    error: [
      addNotification(
        'An unknown error occured when connecting to ZEIT',
        'error'
      ),
    ],
  },
];
