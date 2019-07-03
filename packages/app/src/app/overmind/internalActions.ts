import { json } from 'overmind';
import { Action, AsyncAction } from '.';
import { identify, setUserId } from '@codesandbox/common/lib/utils/analytics';
import {
  Sandbox,
  CurrentUser,
  NotificationButton,
  Contributor,
  Module,
} from '@codesandbox/common/lib/types';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import { generateFileFromSandbox } from '@codesandbox/common/lib/templates/configuration/package-json';

export const setKeybindings: Action = ({ state, effects }) => {
  effects.keybindingManager.set(
    json(state.preferences.settings.keybindings || [])
  );
};

export const setJwtFromStorage: Action = ({ effects, state }) => {
  state.jwt = effects.jwt.get() || null;
};

export const signIn: AsyncAction<{ useExtraScopes: boolean }> = async (
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

export const listenToConnectionChange: Action = ({ effects, actions }) => {
  effects.connection.addListener(actions.connectionChanged);
};

export const setStoredSettings: Action = ({ state, effects }) => {
  const settings = effects.settingsStore.getAll();

  if (settings.keybindings) {
    settings.keybindings = Object.keys(settings.keybindings).reduce(
      (value, key) =>
        value.concat({
          key,
          bindings: settings.keybindings[key],
        }),
      []
    );
  }

  Object.assign(state.preferences.settings, settings);
  // state.merge('preferences.settings', settings);
};

export const startKeybindings: Action = ({ effects }) => {
  effects.keybindingManager.start(() => {
    // Copy code from keybindingmanager
  });
};

export const getUser: Action<void, Promise<CurrentUser>> = ({ effects }) => {
  return effects.api.get('/users/current');
};

export const getSandbox: Action<string, Promise<Sandbox>> = (
  { effects },
  id
) => {
  return effects.api.get(`/sandboxes/${id}`);
};

export const setPatronPrice: Action = ({ state }) => {
  state.patron.price = state.user.subscription
    ? Number(state.user.subscription.amount)
    : 10;
};

export const setSignedInCookie: Action = ({ state }) => {
  document.cookie = 'signedIn=true; Path=/;';
  identify('signed_in', 'true');
  setUserId(state.user.id);
};

export const connectWebsocket: Action = ({ effects }) => {
  effects.socket.connect();
};

export const addNotification: Action<{
  title: string;
  type: 'notice' | 'success' | 'warning' | 'error';
  timeAlive?: number;
  buttons?: Array<NotificationButton>;
}> = ({ state }, { title, type, timeAlive, buttons }) => {
  const now = Date.now();
  const timeAliveDefault = type === 'error' ? 6 : 3;

  state.notifications.push({
    id: now,
    title,
    type,
    buttons,
    endTime: now + (timeAlive ? timeAlive : timeAliveDefault) * 1000,
  });
};

export const removeJwtFromStorage: Action = ({ effects }) => {
  effects.jwt.reset();
};

export const getContributors: AsyncAction = async ({ state, effects }) => {
  try {
    const response = await effects.http.get<{ contributors: Contributor[] }>(
      'https://raw.githubusercontent.com/CompuIves/codesandbox-client/master/.all-contributorsrc'
    );

    state.contributors = response.data.contributors.map(
      contributor => contributor.login
    );
  } catch (error) {}
};

export const authorize: AsyncAction = async ({ state, effects }) => {
  try {
    const data = await effects.api.get<{ token: string }>('/auth/auth-token');
    state.authToken = data.token;
  } catch (error) {
    state.editor.error = error.message;
  }
};

export const signInGithub: Action<
  { useExtraScopes: boolean },
  Promise<string>
> = ({ effects }, options) => {
  const popup = effects.browser.openPopup(
    `/auth/github${options.useExtraScopes ? '?scope=user:email,repo' : ''}`,
    'sign in'
  );

  return effects.browser
    .waitForMessage<{ jwt: string }>('signin')
    .then(data => {
      const jwt = data.jwt;

      popup.close();

      if (jwt) {
        return jwt;
      }

      throw new Error('Could not get sign in token');
    });
};

export const setJwt: Action<string> = ({ state, effects }, jwt) => {
  effects.jwt.set(jwt);
  state.jwt = jwt;
};

export const getZeitUserDetails: AsyncAction = async ({ state, effects }) => {
  if (
    state.user.integrations.zeit &&
    state.user.integrations.zeit.token &&
    !state.user.integrations.zeit.email
  ) {
    const token = state.user.integrations.zeit.token;

    try {
      const response = await effects.http.get('https://api.zeit.co/www/user', {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });

      state.user.integrations.zeit.email = response.data.user.email;
    } catch (error) {
      effects.notificationToast.add({
        message: 'Could not authorize with ZEIT',
        status: effects.notificationToast.convertTypeToStatus('error'),
      });
    }
  }
};

export const closeModals: Action<boolean> = ({ state, actions }, isKeyDown) => {
  if (
    state.currentModal === 'preferences' &&
    state.preferences.itemId === 'keybindings' &&
    isKeyDown
  ) {
    return;
  }

  state.currentModal = null;
  actions.internal.startKeybindings();
};

export const ensureOwnedEditable: AsyncAction = async ({ state, actions }) => {
  if (!state.editor.currentSandbox.owned) {
    return actions.internal.forkSandbox({
      id: state.editor.currentId,
    });
  }

  if (
    state.editor.currentSandbox.owned &&
    state.editor.currentSandbox.isFrozen
  ) {
    return actions.internal.forkFrozenSandbox();
  }
};

export const forkFrozenSandbox: AsyncAction = async ({
  state,
  actions,
  effects,
}) => {
  if (
    effects.browser.confirm(
      'This sandbox is frozen, and will be forked. Do you want to continue?'
    )
  ) {
    return actions.internal.forkSandbox({
      id: state.editor.currentId,
    });
  } else {
    // Where is the callback ID?
    // effects.vscode.callCallbackError(?, "Can't save a frozen sandbox")
  }
};

export const forkSandbox: AsyncAction<{
  id: string;
  body?: Partial<Sandbox>;
}> = async ({ state, effects, actions }, { id, body }) => {
  effects.analytics.track('Fork Sandbox');
  state.editor.isForkingSandbox = true;

  const url = id.includes('/')
    ? `/sandboxes/fork/${id}`
    : `/sandboxes/${id}/fork`;

  try {
    const forkedSandbox = await effects.api.post<Sandbox>(url, body || {});

    if (state.editor.currentSandbox) {
      Object.assign(forkedSandbox, {
        modules: forkedSandbox.modules.map(module => ({
          ...module,
          code: state.editor.currentSandbox.modules.find(
            currentSandboxModule =>
              currentSandboxModule.shortid === module.shortid
          ).code,
        })),
      });
    }

    actions.internal.setSandboxData({
      sandbox: forkedSandbox,
      overwriteFiles: true,
    });

    state.editor.currentId = forkedSandbox.id;

    effects.notificationToast.add({
      message: 'Forked sandbox!',
      status: NotificationStatus.SUCCESS,
    });

    effects.router.updateSandboxUrl(forkedSandbox);
  } catch (error) {}

  state.editor.isForkingSandbox = false;
};

export const setSandboxData: Action<{
  sandbox: Sandbox;
  overwriteFiles: boolean;
}> = ({ state }, { sandbox, overwriteFiles }) => {
  if (overwriteFiles) {
    state.editor.sandboxes[sandbox.id] = sandbox;
  } else {
    state.editor.sandboxes[sandbox.id].collection = sandbox.collection;
    state.editor.sandboxes[sandbox.id].owned = sandbox.owned;
    state.editor.sandboxes[sandbox.id].userLiked = sandbox.userLiked;
    state.editor.sandboxes[sandbox.id].title = sandbox.title;
  }
};

export const ensurePackageJSON: AsyncAction<{
  sandbox: Sandbox;
  newCode: string;
}> = async ({ state, actions }, { sandbox, newCode }) => {
  const existingPackageJson = sandbox.modules.find(
    m => m.directoryShortid == null && m.title === 'package.json'
  );

  if (sandbox.owned && !existingPackageJson) {
    const packageJson = {
      title: 'package.json',
      newCode: generateFileFromSandbox(sandbox),
    };
    const optimisticModule = actions.files.internal.createOptimisticModule(
      packageJson
    );

    state.editor.sandboxes[state.editor.currentId].modules.push(
      optimisticModule
    );

    try {
      const updatedModule = await actions.files.internal.saveNewModule({
        module: optimisticModule,
        newCode,
      });

      actions.files.internal.updateOptimisticModule({
        optimisticModule,
        updatedModule,
      });
    } catch (error) {
      actions.files.internal.removeModule(optimisticModule.shortid);
    }
  }
};
