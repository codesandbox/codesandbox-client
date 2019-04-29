import { types } from 'mobx-state-tree';

export default {
  status: types.enumeration('status', [
    'initializing',
    'connected',
    'disconnected',
  ]),
  containerStatus: types.enumeration('container-status', [
    'initializing',
    'container-started',
    'sandbox-started',
    'stopped',
    'hibernated',
    'error',
  ]),
};
