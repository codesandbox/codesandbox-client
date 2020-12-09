import {
  ModuleTab,
  NotificationButton,
  Sandbox,
  ServerContainerStatus,
  ServerStatus,
  TabType,
} from '@codesandbox/common/lib/types';
import history from 'app/utils/history';
import { patronUrl } from '@codesandbox/common/lib/utils/url-generator';
import { NotificationMessage } from '@codesandbox/notifications/lib/state';
import { NotificationStatus } from '@codesandbox/notifications';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import values from 'lodash-es/values';

import { ApiError } from './effects/api/apiFactory';
import { defaultOpenedModule, mainModule } from './utils/main-module';
import { parseConfigurations } from './utils/parse-configurations';
import { Action, AsyncAction } from '.';
import { TEAM_ID_LOCAL_STORAGE } from './utils/team';

/**
 * After getting the current user we need to hydrate the app with new data from that user.
 * Everything with fetching for the user happens here.
 */
export const initializeNewUser: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  actions.dashboard.getTeams();
  actions.internal.setPatronPrice();
  effects.analytics.identify('signed_in', true);
  effects.analytics.setUserId(state.user!.id, state.user!.email);

  try {
    actions.internal.trackCurrentTeams().catch(e => {});
    actions.internal.identifyCurrentUser().catch(e => {});
  } catch (e) {
    // Not majorly important
  }

  actions.internal.showUserSurveyIfNeeded();
  await effects.live.getSocket();
  actions.userNotifications.internal.initialize();
  actions.internal.setStoredSettings();
  effects.api.preloadTemplates();
};

export const signIn: AsyncAction<{
  useExtraScopes?: boolean;
  provider: 'google' | 'github';
}> = async ({ state, effects, actions }, options) => {
  effects.analytics.track('Sign In', {
    provider: options.provider,
  });
  try {
    await actions.internal.runProviderAuth(options);

    state.signInModalOpen = false;
    state.pendingUser = null;
    state.user = await effects.api.getCurrentUser();
    await actions.internal.initializeNewUser();
    actions.refetchSandboxInfo();
    state.hasLogIn = true;
    state.isAuthenticating = false;
  } catch (error) {
    actions.internal.handleError({
      message: 'Could not authenticate',
      error,
    });
  }
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
      [] as Array<{ key: string; bindings: string }>
    );
  }

  Object.assign(state.preferences.settings, settings);
};

export const setPatronPrice: Action = ({ state }) => {
  if (!state.user) {
    return;
  }

  state.patron.price = state.user.subscription
    ? Number(state.user.subscription.amount)
    : 10;
};

export const showUserSurveyIfNeeded: Action = ({ state, effects, actions }) => {
  if (state.user?.sendSurvey) {
    // Let the server know that we've seen the survey
    effects.api.markSurveySeen();

    effects.notificationToast.add({
      title: 'Help improve CodeSandbox',
      message:
        "We'd love to hear your thoughts, it's 7 questions and will only take 2 minutes.",
      status: NotificationStatus.NOTICE,
      sticky: true,
      actions: {
        primary: {
          label: 'Open Survey',
          run: () => {
            actions.modalOpened({
              modal: 'userSurvey',
            });
          },
        },
      },
    });
  }
};

/**
 * @deprecated
 */
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
    buttons: buttons || [],
    endTime: now + (timeAlive || timeAliveDefault) * 1000,
  });
};

export const authorize: AsyncAction = async ({ state, effects }) => {
  try {
    state.authToken = await effects.api.getAuthToken();
  } catch (error) {
    state.editor.error = error.message;
  }
};
export const runProviderAuth: AsyncAction<
  { useExtraScopes?: boolean; provider?: 'github' | 'google' },
  any
> = ({ effects, state }, { provider, useExtraScopes }) => {
  const hasDevAuth = process.env.LOCAL_SERVER || process.env.STAGING;

  const authPath = new URL(
    location.origin + (hasDevAuth ? '/auth/dev' : `/auth/${provider}`)
  );

  authPath.searchParams.set('version', '2');

  if (provider === 'github') {
    if (useExtraScopes) {
      authPath.searchParams.set('scope', 'user:email,repo');
    }
  }

  const popup = effects.browser.openPopup(authPath.toString(), 'sign in');

  const signInPromise = effects.browser
    .waitForMessage('signin')
    .then((data: any) => {
      if (hasDevAuth) {
        localStorage.setItem('devJwt', data.jwt);

        // Today + 30 days
        const DAY = 1000 * 60 * 60 * 24;
        const expiryDate = new Date(Date.now() + DAY * 30);

        document.cookie = `signedInDev=true; expires=${expiryDate.toUTCString()}; path=/`;
      } else if (data?.jwt) {
        effects.api.revokeToken(data.jwt);
      }
      popup.close();
    });

  effects.browser.waitForMessage('duplicate').then((data: any) => {
    state.duplicateAccountStatus = {
      duplicate: true,
      provider: data.provider,
    };
    popup.close();
  });

  effects.browser.waitForMessage('signup').then((data: any) => {
    state.pendingUserId = data.id;
    popup.close();
  });

  return signInPromise;
};

export const closeModals: Action<boolean> = ({ state, effects }, isKeyDown) => {
  if (
    state.currentModal === 'preferences' &&
    state.preferences.itemId === 'keybindings' &&
    isKeyDown
  ) {
    return;
  }

  state.currentModal = null;
};

export const switchCurrentWorkspaceBySandbox: Action<{ sandbox: Sandbox }> = (
  { state, actions },
  { sandbox }
) => {
  if (
    hasPermission(sandbox.authorization, 'owner') &&
    state.user &&
    sandbox.team
  ) {
    actions.setActiveTeam({ id: sandbox.team.id });
  }
};

export const currentSandboxChanged: Action = ({ state, actions }) => {
  const sandbox = state.editor.currentSandbox!;
  actions.internal.switchCurrentWorkspaceBySandbox({
    sandbox,
  });
};

export const setCurrentSandbox: AsyncAction<Sandbox> = async (
  { state, effects, actions },
  sandbox
) => {
  state.editor.sandboxes[sandbox.id] = sandbox;
  state.editor.currentId = sandbox.id;

  let { currentModuleShortid } = state.editor;
  const parsedConfigs = parseConfigurations(sandbox);
  const main = mainModule(sandbox, parsedConfigs);

  state.editor.mainModuleShortid = main?.shortid;

  // Only change the module shortid if it doesn't exist in the new sandbox
  // This can happen when a sandbox is opened that's different from the current
  // sandbox, with completely different files
  if (
    !sandbox.modules.find(module => module.shortid === currentModuleShortid)
  ) {
    const defaultModule = defaultOpenedModule(sandbox, parsedConfigs);

    currentModuleShortid = defaultModule.shortid;
  }

  const sandboxOptions = effects.router.getSandboxOptions();

  if (sandboxOptions.currentModule) {
    try {
      const resolvedModule = effects.utils.resolveModule(
        sandboxOptions.currentModule,
        sandbox.modules,
        sandbox.directories
      );
      currentModuleShortid = resolvedModule
        ? resolvedModule.shortid
        : currentModuleShortid;
    } catch (error) {
      actions.internal.handleError({
        message: `Could not find module ${sandboxOptions.currentModule}`,
        error,
      });
    }
  }

  state.editor.currentModuleShortid = currentModuleShortid;
  state.editor.workspaceConfigCode = '';

  state.server.status = ServerStatus.INITIALIZING;
  state.server.containerStatus = ServerContainerStatus.INITIALIZING;
  state.server.error = null;
  state.server.hasUnrecoverableError = false;
  state.server.ports = [];

  const newTab: ModuleTab = {
    type: TabType.MODULE,
    moduleShortid: currentModuleShortid,
    dirty: true,
  };

  state.editor.tabs = [newTab];

  state.preferences.showPreview = Boolean(
    sandboxOptions.isPreviewScreen || sandboxOptions.isSplitScreen
  );

  state.preferences.showEditor = Boolean(
    sandboxOptions.isEditorScreen || sandboxOptions.isSplitScreen
  );

  if (sandboxOptions.initialPath)
    state.editor.initialPath = sandboxOptions.initialPath;
  if (sandboxOptions.fontSize)
    state.preferences.settings.fontSize = sandboxOptions.fontSize;
  if (sandboxOptions.highlightedLines)
    state.editor.highlightedLines = sandboxOptions.highlightedLines;
  if (sandboxOptions.hideNavigation)
    state.preferences.hideNavigation = sandboxOptions.hideNavigation;
  if (sandboxOptions.isInProjectView)
    state.editor.isInProjectView = sandboxOptions.isInProjectView;
  if (sandboxOptions.autoResize)
    state.preferences.settings.autoResize = sandboxOptions.autoResize;
  if (sandboxOptions.enableEslint)
    state.preferences.settings.enableEslint = sandboxOptions.enableEslint;
  if (sandboxOptions.forceRefresh)
    state.preferences.settings.forceRefresh = sandboxOptions.forceRefresh;
  if (sandboxOptions.expandDevTools)
    state.preferences.showDevtools = sandboxOptions.expandDevTools;
  if (sandboxOptions.runOnClick)
    state.preferences.runOnClick = sandboxOptions.runOnClick;

  state.workspace.project.title = sandbox.title || '';
  state.workspace.project.description = sandbox.description || '';
  state.workspace.project.alias = sandbox.alias || '';

  // Do this before startContainer, because startContainer flushes in overmind and causes
  // the components to rerender. Because of this sometimes the GitHub component will get a
  // sandbox without a git
  actions.workspace.openDefaultItem();
  actions.server.startContainer(sandbox);

  actions.internal.currentSandboxChanged();
};

export const closeTabByIndex: Action<number> = ({ state }, tabIndex) => {
  const { currentModule } = state.editor;
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

export const getErrorMessage: Action<{ error: ApiError | Error }, string> = (
  context,
  { error }
) => {
  const isGenericError =
    !('response' in error) ||
    error.response == null ||
    error.response.status >= 500;

  if (isGenericError) {
    return error.message;
  }

  const { response } = error as ApiError;
  /*
    Update error message with what is coming from the server
  */
  const result = response?.data;

  if (result) {
    if (typeof result === 'string') {
      return result;
    }
    if ('errors' in result) {
      const errors = values(result.errors)[0];
      const fields = Object.keys(result.errors);

      if (Array.isArray(errors)) {
        if (errors[0]) {
          if (fields[0] === 'detail') {
            return errors[0];
          }
          return `${fields[0]}: ${errors[0]}`; // eslint-disable-line no-param-reassign,prefer-destructuring
        }
      } else {
        return errors; // eslint-disable-line no-param-reassign
      }
    } else if (result.error) {
      if (result.error.message) {
        return result.error.message;
      }

      return result.error; // eslint-disable-line no-param-reassign
    } else if (response?.status === 413) {
      return 'File too large, upload limit is 5MB.';
    }
  }

  return error.message;
};

export const handleError: Action<{
  /*
    The message that will show as title of the notification
  */
  message: string;
  error: ApiError | Error;
  hideErrorMessage?: boolean;
}> = (
  { actions, effects, state },
  { message, error, hideErrorMessage = false }
) => {
  if (hideErrorMessage) {
    effects.analytics.logError(error);
    effects.notificationToast.add({
      message,
      status: NotificationStatus.ERROR,
    });

    return;
  }

  const isGenericError =
    !('response' in error) ||
    error.response == null ||
    error.response.status >= 500;

  if (isGenericError) {
    effects.analytics.logError(error);
    effects.notificationToast.add({
      title: message,
      message: error.message,
      status: NotificationStatus.ERROR,
    });

    return;
  }

  error.message = actions.internal.getErrorMessage({ error });

  const notificationActions: NotificationMessage['actions'] = {};

  if (error.message.startsWith('You need to sign in to create more than')) {
    // Error for "You need to sign in to create more than 10 sandboxes"
    effects.analytics.track('Anonymous Sandbox Limit Reached', {
      errorMessage: error.message,
    });

    notificationActions.primary = {
      label: 'Sign in',
      run: () => {
        state.signInModalOpen = true;
      },
    };
  } else if (error.message.startsWith('You reached the maximum of')) {
    effects.analytics.track('Non-Patron Sandbox Limit Reached', {
      errorMessage: error.message,
    });

    notificationActions.primary = {
      label: 'Open Patron Page',
      run: () => {
        window.open(patronUrl(), '_blank');
      },
    };
  } else if (
    error.message.startsWith(
      'You reached the limit of server sandboxes, you can create more server sandboxes as a patron.'
    )
  ) {
    effects.analytics.track('Non-Patron Server Sandbox Limit Reached', {
      errorMessage: error.message,
    });

    notificationActions.primary = {
      label: 'Open Patron Page',
      run: () => {
        window.open(patronUrl(), '_blank');
      },
    };
  } else if (
    error.message.startsWith(
      'You reached the limit of server sandboxes, we will increase the limit in the future. Please contact hello@codesandbox.io for more server sandboxes.'
    )
  ) {
    effects.analytics.track('Patron Server Sandbox Limit Reached', {
      errorMessage: error.message,
    });
  }

  effects.notificationToast.add({
    title: message,
    message: error.message,
    status: NotificationStatus.ERROR,
    ...(notificationActions.primary ? { actions: notificationActions } : {}),
  });
};

export const trackCurrentTeams: AsyncAction = async ({ effects, state }) => {
  const user = state.user;
  if (!user) {
    return;
  }

  if (state.activeTeamInfo) {
    effects.analytics.setGroup('teamName', state.activeTeamInfo.name);
    effects.analytics.setGroup('teamId', state.activeTeamInfo.id);
  } else {
    effects.analytics.setGroup('teamName', []);
    effects.analytics.setGroup('teamId', []);
  }
};

export const identifyCurrentUser: AsyncAction = async ({ state, effects }) => {
  const user = state.user;
  if (user) {
    effects.analytics.identify('pilot', user.experiments.inPilot);
    effects.browser.storage.set('pilot', user.experiments.inPilot);

    const profileData = await effects.api.getProfile(user.username);
    effects.analytics.identify('sandboxCount', profileData.sandboxCount);
    effects.analytics.identify('pro', Boolean(profileData.subscriptionSince));
    effects.analytics.identify('receivedViewCount', profileData.viewCount);
  }
};

const seenTermsKey = 'ACCEPTED_TERMS_CODESANDBOX';
export const showPrivacyPolicyNotification: Action = ({ effects, state }) => {
  if (effects.browser.storage.get(seenTermsKey)) {
    return;
  }

  if (!state.isFirstVisit) {
    effects.analytics.track('Saw Privacy Policy Notification');
    effects.notificationToast.add({
      message:
        'Hello, our privacy policy has been updated recently. What’s new? CodeSandbox emails. Please read and reach out.',
      title: 'Updated Privacy',
      status: NotificationStatus.NOTICE,
      sticky: true,
      actions: {
        primary: {
          label: 'Open Privacy Policy',
          run: () => {
            window.open('https://codesandbox.io/legal/privacy', '_blank');
          },
        },
      },
    });
  }

  effects.browser.storage.set(seenTermsKey, true);
};

const VIEW_MODE_DASHBOARD = 'VIEW_MODE_DASHBOARD';
export const setViewModeForDashboard: Action = ({ effects, state }) => {
  const localStorageViewMode = effects.browser.storage.get(VIEW_MODE_DASHBOARD);
  if (localStorageViewMode === 'grid' || localStorageViewMode === 'list') {
    state.dashboard.viewMode = localStorageViewMode;
  }
};

export const setActiveTeamFromUrlOrStore: AsyncAction<void, string> = async ({
  actions,
}) =>
  actions.internal.setActiveTeamFromUrl() ||
  actions.internal.setActiveTeamFromLocalStorage() ||
  actions.internal.setActiveTeamFromPersonalWorkspaceId();

export const setActiveTeamFromLocalStorage: Action<void, string | null> = ({
  effects,
  actions,
}) => {
  const localStorageTeam = effects.browser.storage.get(TEAM_ID_LOCAL_STORAGE);

  if (typeof localStorageTeam === 'string') {
    actions.setActiveTeam({ id: localStorageTeam });
    return localStorageTeam;
  }

  return null;
};

export const setActiveTeamFromUrl: Action<void, string | null> = ({
  actions,
}) => {
  const currentUrl =
    typeof document === 'undefined' ? null : document.location.href;
  if (!currentUrl) {
    return null;
  }

  const searchParams = new URL(currentUrl).searchParams;

  const workspaceParam = searchParams.get('workspace');
  if (workspaceParam) {
    actions.setActiveTeam({ id: workspaceParam });
    return workspaceParam;
  }

  return null;
};

export const setActiveTeamFromPersonalWorkspaceId: AsyncAction<
  void,
  string
> = async ({ actions, state, effects }) => {
  const personalWorkspaceId = state.personalWorkspaceId;

  if (personalWorkspaceId) {
    actions.setActiveTeam({ id: personalWorkspaceId });
    return personalWorkspaceId;
  }
  const res = await effects.gql.queries.getPersonalWorkspaceId({});
  if (res.me) {
    actions.setActiveTeam({ id: res.me.personalWorkspaceId });
    return res.me.personalWorkspaceId;
  }

  return null;
};

export const replaceWorkspaceParameterInUrl: Action = ({ state }) => {
  const id = state.activeTeam;
  const currentUrl =
    typeof document === 'undefined' ? null : document.location.href;

  if (!currentUrl) {
    return;
  }

  const urlInfo = new URL(currentUrl);
  const params = urlInfo.searchParams;
  if (!params.get('workspace')) {
    return;
  }

  if (id) {
    urlInfo.searchParams.set('workspace', id);
  } else {
    urlInfo.searchParams.delete('workspace');
  }

  history.replace(urlInfo.toString().replace(urlInfo.origin, ''));
};
