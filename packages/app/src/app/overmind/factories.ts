import { Contributor } from '@codesandbox/common/lib/types';
import { json } from 'overmind';
import { AsyncAction } from '.';

export const withLoadApp = <T>(
  continueAction?: AsyncAction<T>
): AsyncAction<T> => async (context, value) => {
  const { effects, state, actions } = context;

  if (state.hasLoadedApp && continueAction) {
    await continueAction(context, value);
    return;
  } else if (state.hasLoadedApp) {
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
  effects.codesandboxApi.listen(actions.server.onCodeSandboxAPIMessage);

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

  if (continueAction) {
    await continueAction(context, value);
  }

  state.hasLoadedApp = true;
  state.isAuthenticating = false;

  try {
    const response = await effects.http.getJson<{
      contributors: Contributor[];
    }>(
      'https://raw.githubusercontent.com/codesandbox/codesandbox-client/master/.all-contributorsrc'
    );

    state.contributors = response.data.contributors.map(
      contributor => contributor.login
    );
  } catch (error) {
    // Something wrong in the parsing probably, make sure the file is JSON valid
  }
};

export const withOwnedSandbox = <T>(
  continueAction: AsyncAction<T>
): AsyncAction<T> => async (context, payload) => {
  const { state, actions, effects } = context;

  if (
    !state.editor.currentSandbox.owned ||
    (state.editor.currentSandbox.owned &&
      state.editor.currentSandbox.isFrozen &&
      effects.browser.confirm(
        'This sandbox is frozen, and will be forked. Do you want to continue?'
      ))
  ) {
    await actions.editor.internal.forkSandbox({
      sandboxId: state.editor.currentId,
    });
  }

  return continueAction(context, payload);
};
