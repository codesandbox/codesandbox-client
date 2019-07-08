import { json } from 'overmind';
import { Action, AsyncAction } from '.';
import { identify, setUserId } from '@codesandbox/common/lib/utils/analytics';
import {
  Sandbox,
  CurrentUser,
  NotificationButton,
  Contributor,
  Module,
  TabType,
  ModuleTab,
} from '@codesandbox/common/lib/types';
import { NotificationStatus } from '@codesandbox/notifications/lib/state';
import { generateFileFromSandbox as generatePackageJsonFromSandbox } from '@codesandbox/common/lib/templates/configuration/package-json';
import { parseConfigurations } from './utils/parse-configurations';
import { defaultOpenedModule, mainModule } from './utils/main-module';

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

export const setCurrentSandbox: Action<Sandbox> = (
  { state, actions, effects },
  sandbox
) => {
  state.editor.sandboxes[sandbox.id] = sandbox;
  state.editor.currentId = sandbox.id;

  let currentModuleShortid = state.editor.currentModuleShortid;
  const parsedConfigs = parseConfigurations(sandbox);
  const main = mainModule(sandbox, parsedConfigs);

  state.editor.mainModuleShortid = main.shortid;

  // Only change the module shortid if it doesn't exist in the new sandbox
  // What is the scenario here?
  if (sandbox.modules.find(module => module.shortid === currentModuleShortid)) {
    const defaultModule = defaultOpenedModule(sandbox, parsedConfigs);

    currentModuleShortid = defaultModule.shortid;
  }

  const sandboxOptions = effects.router.getSandboxOptions();

  if (sandboxOptions.currentModule) {
    const sandbox = state.editor.currentSandbox;

    try {
      const resolvedModule = effects.utils.resolveModule(
        sandboxOptions.currentModule,
        sandbox.modules,
        sandbox.directories,
        // currentModule is a string... something wrong here?
        sandboxOptions.currentModule.directoryShortid
      );
      currentModuleShortid = resolvedModule
        ? resolvedModule.shortid
        : currentModuleShortid;
    } catch (err) {
      effects.notificationToast.warning(
        `Could not find the module ${sandboxOptions.currentModule}`
      );
    }
  }

  state.editor.currentModuleShortid = currentModuleShortid;

  const newTab: ModuleTab = {
    type: TabType.MODULE,
    moduleShortid: currentModuleShortid,
    dirty: true,
  };

  state.editor.tabs = [newTab];

  actions.preferences.internal.updatePreferencesFromSandboxOptions(
    sandboxOptions
  );
  actions.workspace.internal.configureWorkspace(sandbox);
  effects.fsSync.syncCurrentSandbox();
  effects.router.updateSandboxUrl(sandbox);
};

export const updateCurrentSandbox: AsyncAction<Sandbox> = async (
  { state },
  sandbox
) => {
  state.editor.currentSandbox.team = sandbox.team || null;
  state.editor.currentSandbox.collection = sandbox.collection;
  state.editor.currentSandbox.owned = sandbox.owned;
  state.editor.currentSandbox.userLiked = sandbox.userLiked;
  state.editor.currentSandbox.title = sandbox.title;
};

export const ensurePackageJSON: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  const sandbox = state.editor.currentSandbox;
  const existingPackageJson = sandbox.modules.find(
    module => module.directoryShortid == null && module.title === 'package.json'
  );

  if (sandbox.owned && !existingPackageJson) {
    const optimisticModule = actions.files.internal.createOptimisticModule({
      title: 'package.json',
      code: generatePackageJsonFromSandbox(sandbox),
    });

    state.editor.currentSandbox.modules.push(optimisticModule);

    try {
      const updatedModule = await effects.api.createModule(
        sandbox.id,
        optimisticModule
      );

      optimisticModule.id = updatedModule.id;
      optimisticModule.shortid = updatedModule.shortid;
    } catch (error) {
      sandbox.modules.splice(sandbox.modules.indexOf(optimisticModule), 1);
    }
  }
};

export const closeTabByIndex: Action<number> = ({ state }, tabIndex) => {
  const currentModule = state.editor.currentModule;
  const tabs = state.editor.tabs as ModuleTab[];
  const isActiveTab = currentModule.shortid === tabs[tabIndex].moduleShortid;

  if (isActiveTab) {
    const newTab = tabIndex > 0 ? tabs[tabIndex - 1] : tabs[tabIndex + 1];

    if (newTab) {
      state.editor.currentModuleShortid = newTab.moduleShortid;
    }
  }

  state.editor.tabs.splice(tabIndex, 1);
};
