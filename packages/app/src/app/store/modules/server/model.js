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
  error: types.maybe(types.string),
  hasUnrecoverableError: types.boolean,
  ports: types.array(
    types.model({
      port: types.number,
      main: types.boolean,
      hostname: types.string,
    })
  ),
};
