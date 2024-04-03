import { Contributor, PermissionType } from '@codesandbox/common/lib/types';
import { identify } from '@codesandbox/common/lib/utils/analytics';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import { NotificationStatus } from '@codesandbox/notifications';
import { IState, derived, ContextFunction } from 'overmind';
import { Context } from '.';
import { renameZeitToVercel } from './utils/vercel';

/*
  Ensures that we have loaded the app with the initial user
  and settings
*/
export const withLoadApp = <I>(
  continueAction?: ContextFunction<I, void>
) => async (context: Context, value: I) => {
  const { effects, state, actions } = context;

  if (state.hasLoadedApp && continueAction) {
    await continueAction(context, value);
    return;
  }
  if (state.hasLoadedApp) {
    return;
  }

  state.isAuthenticating = true;

  effects.connection.addListener(actions.connectionChanged);
  actions.internal.setStoredSettings();
  actions.internal.prefetchOfficialTemplates();
  effects.codesandboxApi.listen(actions.server.onCodeSandboxAPIMessage);

  if (localStorage.jwt) {
    // We've introduced a new way of signing in to CodeSandbox, and we should let the user know to
    // convert to it.

    document.cookie =
      'signedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    state.hasLogIn = false;

    try {
      const jwt = JSON.parse(localStorage.jwt);
      effects.api.revokeToken(jwt);
    } catch (e) {
      // Ignore
    }

    delete localStorage.jwt;
    notificationState.addNotification({
      sticky: true,
      message:
        'Sorry, we had to sign you out. Please sign in again to continue.',
      status: NotificationStatus.NOTICE,
      actions: {
        primary: {
          label: 'Sign in',
          run: () => {
            actions.signInClicked();
          },
        },
      },
    });
  }

  if (state.hasLogIn) {
    try {
      await Promise.all([
        effects.api.getCurrentUser().then(user => {
          state.user = renameZeitToVercel(user);
        }),
      ]);

      await actions.internal.initializeNewUser();
      state.hasLogIn = true;
    } catch (error) {
      actions.internal.handleError({
        message: 'We had trouble with signing you in',
        error,
      });
    }
  } else {
    identify('signed_in', false);
    effects.analytics.setAnonymousId();
  }

  if (continueAction) {
    await continueAction(context, value);
  }

  state.hasLoadedApp = true;
  state.isAuthenticating = false;

  try {
    const response = await effects.http.get<{
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

export const withOwnedSandbox = <I>(
  continueAction: ContextFunction<I, void>,
  cancelAction: ContextFunction<I, void> = () => Promise.resolve(),
  requiredPermission?: PermissionType
): ContextFunction<I, void> => async (context: Context, payload: I) => {
  const { state, actions } = context;

  const sandbox = state.editor.currentSandbox;

  if (sandbox) {
    if (
      typeof requiredPermission === 'undefined'
        ? !sandbox.owned
        : !hasPermission(sandbox.authorization, requiredPermission)
    ) {
      if (state.editor.isForkingSandbox) {
        return cancelAction(context, payload);
      }

      try {
        await actions.editor.internal.forkSandbox({
          sandboxId: sandbox.id,
        });
      } catch (e) {
        // If we know the error is caused by an anonymous user trying to save a
        // file and fork a server sandbox, we don't want to show the vscode error
        // with the cancelAction and we don't want to continue either.
        if (e.message === 'ERR_ANON_SSE_FORK') {
          return () => {};
        }

        return cancelAction(context, payload);
      }
    } else if (sandbox.isFrozen && state.editor.sessionFrozen) {
      const modalResponse = await actions.modals.forkFrozenModal.open();

      if (modalResponse === 'fork') {
        try {
          await actions.editor.internal.forkSandbox({
            sandboxId: sandbox.id,
          });
        } catch (e) {
          return cancelAction(context, payload);
        }
      } else if (modalResponse === 'unfreeze') {
        state.editor.sessionFrozen = false;
      } else if (modalResponse === 'cancel') {
        return cancelAction(context, payload);
      }
    }
  }

  return continueAction(context, payload);
};

export const createModals = <
  T extends {
    [name: string]: {
      state?: IState;
      result?: unknown;
    };
  }
>(
  modals: T
): {
  state: {
    current: keyof T | null;
  } & {
    [K in keyof T]: T[K]['state'] & { isCurrent: boolean };
  };
  actions: {
    [K in keyof T]: {
      open: ContextFunction<
        T[K]['state'] extends IState ? T[K]['state'] : void,
        T[K]['result']
      >;
      close: ContextFunction<T[K]['result'], void>;
    };
  };
} => {
  function createModal(name, modal) {
    let resolver: ((res: T) => void) | null;

    const open = async ({ state }: Context, newState = {}) => {
      state.modals.current = name;

      Object.assign(state.modals[name], newState);

      return new Promise(resolve => {
        resolver = resolve;
      });
    };

    const close = async ({ state }: Context, payload) => {
      state.modals.current = null;
      if (modal.state) {
        Object.keys(modal.state).forEach(stateKey => {
          state.modals[name][stateKey] = modal.state[stateKey];
        });
      }
      if (resolver) {
        resolver(typeof payload === 'undefined' ? modal.result : payload);
      }
    };

    return {
      state: {
        ...modal.state,
        isCurrent: derived(
          (_, root: Context['state']) => root.modals.current === name
        ),
      },
      actions: {
        open,
        close,
      },
    };
  }

  return Object.keys(modals).reduce(
    (aggr, name) => {
      const modal = createModal(name, modals[name]);

      aggr.state[name] = modal.state;
      aggr.actions[name] = modal.actions;

      return aggr;
    },
    {
      state: {
        current: null,
      },
      actions: {},
    }
  ) as any;
};
