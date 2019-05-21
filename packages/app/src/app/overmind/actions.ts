import { Action } from '.';
import * as internalActions from './internalActions';
import { withLoadApp } from './factories';

export const internal = internalActions;

export const appUnmounted: Action = async ({ effects, actions }) => {
  effects.connection.removeListener(actions.internal.onConnectionChange);
};

export const sandboxPageMounted: Action = withLoadApp();

export const searchMounted: Action = withLoadApp();

export const cliMounted: Action = withLoadApp(async ({ state, actions }) => {
  if (state.user) {
    await actions.internal.authorize();
  }
});
