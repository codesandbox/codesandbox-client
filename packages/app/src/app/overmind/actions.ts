import { Action } from '.';
import * as internalActions from './internalActions';
import { withLoadApp } from './factories';

export const internal = internalActions;

export const appUnmounted: Action = async ({ effects, actions }) => {
  effects.connection.removeListener(actions.internal.onConnectionChange);
};

export const sandboxPageMounted: Action = withLoadApp(() => {});
