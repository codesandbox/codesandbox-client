import { Action } from '.';

export function withLoadApp<T>(continueAction: Action<T>): Action<T> {
  return async (context, value) => {
    const { state, actions, effects } = context;

    if (state.hasLoadedApp) {
      return continueAction(context, value);
    }

    state.isAuthenticating = true;
    actions.internal.setJwtFromStorage();
    actions.internal.listenToConnectionChange();
    actions.internal.setStoredSettings();
    actions.internal.setKeybindings();
    actions.internal.startKeybindings();

    if (state.jwt) {
      try {
        state.user = await actions.internal.getUser();
        actions.internal.setPatronPrice();
        actions.internal.setSignedInCookie();
        actions.internal.connectWebsocket();
        actions.userNotifications.internal.initialize();
      } catch (error) {
        actions.internal.addNotification({
          title: 'Your session seems to be expired, please log in again...',
          type: 'error',
        });
        actions.internal.removeJwtFromStorage();
      }
      await continueAction(context, value);
    } else {
      actions.internal.removeJwtFromStorage();
      await continueAction(context, value);
    }
    state.hasLoadedApp = true;
    state.isAuthenticating = false;
    await actions.internal.getContributors();
  };
}
