import { set } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import { addNotification } from '../../../../factories';
import * as actions from './actions';

export const deploy = [
  set(state`editor.deployment.deploying`, true),
  actions.createZip,
  actions.loadZip,
  actions.createApiData,
  actions.postToZeit,
  {
    success: [
      set(state`editor.deployment.url`, props`url`),
      set(state`editor.deployment.deploying`, false),
    ],
    error: [
      addNotification(
        'An unknown error occured when connecting to ZEIT',
        'error'
      ),
    ],
  },
];
