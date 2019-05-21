import { Action } from '.';
import * as internalActions from './internalActions';
import { withLoadApp } from './factories';

export const internal = internalActions;

export const appUnmounted: Action = async ({ effects, actions }) => {
  effects.connection.removeListener(actions.connectionChanged);
};

export const sandboxPageMounted: Action = withLoadApp();

export const searchMounted: Action = withLoadApp();

export const cliMounted: Action = withLoadApp(async ({ state, actions }) => {
  if (state.user) {
    await actions.internal.authorize();
  }
});

export const cliInstructionsMounted: Action = withLoadApp();

export const githubPageMounted: Action = withLoadApp();

export const connectionChanged: Action<boolean> = ({ state }, connected) => {
  state.connected = connected;
};

export const modalOpened: Action<{ modal: string; message: string }> = (
  { state, effects },
  { modal, message }
) => {
  effects.analytics.track('Open Modal', { modal });
  state.currentModalMessage = message;
  state.currentModal = modal;
};

export const modalClosed: Action = ({ state }) => {
  state.currentModal = null;
};

export const signInClicked: Action<{ useExtraScopes: boolean }> = async (
  { state, effects, actions },
  options
) => {
  state.isAuthenticating = true;
  effects.analytics.track('Sign In', {});
  try {
    const jwt = await actions.internal.signInGithub(options);
    actions.internal.setJwt(jwt);
    state.user = await actions.internal.getUser();
    actions.internal.setPatronPrice();
    actions.internal.setSignedInCookie();
    actions.internal.setStoredSettings();
    actions.internal.connectWebsocket();
    actions.userNotifications.internal.initialize(); // Seemed a bit differnet originally?
    actions.editor.internal.refetchSandboxInfo();
  } catch (error) {
    actions.internal.addNotification({
      title: 'Github Authentication Error',
      type: 'error',
    });
  }
};
