import { set } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import { addNotification } from '../../factories';
import * as actions from './actions';
import { getZeitUserDetails } from '../../sequences';

export const openDeployModal = [
  set(state`currentModal`, 'deployment'),
  getZeitUserDetails,
  set(state`deployment.url`, null),
];

export const deploymentToDelete = [
  set(state`deployment.deployToDelete`, props`id`),
];

export const getDeploys = [
  actions.getDeploymentData,
  set(state`deployment.gettingDeploys`, true),
  actions.getDeploys,
  {
    success: [
      set(state`deployment.gettingDeploys`, false),
      set(state`deployment.sandboxDeploys`, props`sandboxDeploys`),
    ],
    error: [
      addNotification(
        'An unknown error occurred when connecting to ZEIT',
        'error'
      ),
    ],
  },
];

export const aliasDeployment = [
  actions.getDeploymentData,
  actions.aliasDeployment,
  {
    success: [addNotification(props`message`, 'success'), getDeploys],
    error: [
      addNotification(
        'An unknown error occurred when aliasing your deployment',
        'error'
      ),
    ],
  },
];

export const deleteDeployment = [
  set(state`currentModal`, null),
  set(state`deployment.${state`deployment.deployToDelete`}Deleting`, true),
  actions.deleteDeployment,
  {
    success: [addNotification('Deployment deleted', 'success'), getDeploys],
    error: [
      set(state`deployment.${state`deployment.deployToDelete`}Deleting`, false),
      addNotification(
        'An unknown error occurred when deleting your deployment',
        'error'
      ),
    ],
  },
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
        'An unknown error occurred when connecting to ZEIT',
        'error'
      ),
      set(state`deployment.deploying`, false),
    ],
  },
  getDeploys,
];
