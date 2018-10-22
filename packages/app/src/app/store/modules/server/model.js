import { types } from 'mobx-state-tree';

export default {
  status: types.enumeration('status', [
    'connected',
    'disconnected',
    'initializing',
    'hibernated',
    'error',
  ]),
};
