import { Action, AsyncAction } from '.';
import { Contributor } from '@codesandbox/common/lib/types';
import { json } from 'overmind';

export function withLoadApp<T>(
  continueAction?: AsyncAction<T>
): AsyncAction<T> {
  return async (context, value) => {
    const { effects, state, actions } = context;

    if (state.hasLoadedApp) {
      continueAction(context, value);
      return;
    }

    state.isAuthenticating = true;
    state.jwt = effects.jwt.get() || null;
    effects.connection.addListener(actions.connectionChanged);
    actions.internal.setStoredSettings();
    effects.keybindingManager.set(
      json(state.preferences.settings.keybindings || [])
    );
    effects.keybindingManager.start();

    if (state.jwt) {
      try {
        state.user = await effects.api.getCurrentUser();
        actions.internal.setPatronPrice();
        actions.internal.setSignedInCookie();
        effects.live.connect();
        actions.userNotifications.internal.initialize();
        effects.api.preloadTemplates();
      } catch (error) {
        effects.notificationToast.error(
          'Your session seems to be expired, please log in again...'
        );
        effects.jwt.reset();
      }
    } else {
      effects.jwt.reset();
    }

    continueAction && (await continueAction(context, value));

    state.hasLoadedApp = true;
    state.isAuthenticating = false;

    try {
      const response = await effects.http.get<{ contributors: Contributor[] }>(
        'https://raw.githubusercontent.com/CompuIves/codesandbox-client/master/.all-contributorsrc'
      );

      state.contributors = response.data.contributors.map(
        contributor => contributor.login
      );
    } catch (error) {
      console.log(error);
    }
  };
}
