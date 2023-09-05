import {
  ModuleTab,
  NotificationButton,
  Sandbox,
  ServerContainerStatus,
  ServerStatus,
  TabType,
} from '@codesandbox/common/lib/types';
import history from 'app/utils/history';
import { NotificationMessage } from '@codesandbox/notifications/lib/state';
import { NotificationStatus } from '@codesandbox/notifications';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import values from 'lodash-es/values';

import { TeamFragmentDashboardFragment } from 'app/graphql/types';
import { ApiError } from './effects/api/apiFactory';
import { defaultOpenedModule, mainModule } from './utils/main-module';
import { parseConfigurations } from './utils/parse-configurations';
import { Context } from '.';
import { TEAM_ID_LOCAL_STORAGE } from './utils/team';
import { AuthOptions, GH_BASE_SCOPE, MAP_GH_SCOPE_OPTIONS } from './utils/auth';
import { renameZeitToVercel } from './utils/vercel';

/**
 * After getting the current user we need to hydrate the app with new data from that user.
 * Everything with fetching for the user happens here.
 */
export const initializeNewUser = async ({
  state,
  effects,
  actions,
}: Context) => {
  actions.dashboard.getTeams();
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

export const signIn = async (
  { state, effects, actions }: Context,
  options: AuthOptions
) => {
  effects.analytics.track('Sign In', {
    provider: options.provider,
  });
  try {
    await actions.internal.runProviderAuth(options);

    state.signInModalOpen = false;
    state.cancelOnLogin = null;
    state.pendingUser = null;

    const currentUser = await effects.api.getCurrentUser();
    state.user = renameZeitToVercel(currentUser);

    await actions.internal.initializeNewUser();
    actions.refetchSandboxInfo();
    state.hasLogIn = true;
    state.isAuthenticating = false;
    actions.getActiveTeamInfo();
  } catch (error) {
    actions.internal.handleError({
      message: 'Could not authenticate',
      error,
    });
  }
};

export const setStoredSettings = ({ state, effects }: Context) => {
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

export const showUserSurveyIfNeeded = ({
  state,
  effects,
  actions,
}: Context) => {
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
export const addNotification = (
  { state }: Context,
  {
    title,
    type,
    timeAlive,
    buttons,
  }: {
    title: string;
    type: 'notice' | 'success' | 'warning' | 'error';
    timeAlive?: number;
    buttons?: Array<NotificationButton>;
  }
) => {
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

export const authorize = async ({ state, effects }: Context) => {
  try {
    state.isLoadingAuthToken = true;
    state.authToken = await effects.api.getAuthToken();
  } catch (error) {
    state.editor.error = error.message;
  } finally {
    state.isLoadingAuthToken = false;
  }
};
export const runProviderAuth = (
  { effects, state }: Context,
  options: AuthOptions
) => {
  const { provider } = options;

  // When in development, check if there's authentication.
  const isInitialDevelopmentAuth =
    process.env.NODE_ENV === 'development' && !state.hasLogIn;
  // Use dev auth if local server or staging and there's no
  // authentication or the provider isn't GitHub. This is
  // needed to allow us to go to GitHub to authorize extra
  // scopes during development.
  const useDevAuth =
    (process.env.LOCAL_SERVER || process.env.STAGING) &&
    (isInitialDevelopmentAuth || provider !== 'github');
  // Base path
  const baseUrl = useDevAuth
    ? location.origin
    : process.env.ENDPOINT || 'https://codesandbox.io';

  let authPath = new URL(
    baseUrl + (useDevAuth ? '/auth/dev' : `/auth/${provider}`)
  );

  authPath.searchParams.set('version', '2');

  if (provider === 'github') {
    let scope = GH_BASE_SCOPE;
    if (
      'includedScopes' in options &&
      typeof options.includedScopes !== 'undefined'
    ) {
      scope =
        GH_BASE_SCOPE + ',' + MAP_GH_SCOPE_OPTIONS[options.includedScopes];
    }
    authPath.searchParams.set('scope', scope);
  }

  if (provider === 'sso') {
    authPath = new URL(baseUrl + options.ssoURL);
  }

  const popup = effects.browser.openPopup(authPath.toString(), 'sign in');

  const signInPromise = effects.browser
    .waitForMessage('signin')
    .then((data: any) => {
      if (useDevAuth) {
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

    // Temporarily hide the editor onboarding for new users
    // since its UI and contents are outdated.
    effects.browser.storage.set('should-onboard-user', false);

    popup.close();
  });

  return signInPromise;
};

export const closeModals = ({ state }: Context, isKeyDown: boolean) => {
  if (
    state.currentModal === 'preferences' &&
    state.preferences.itemId === 'keybindings' &&
    isKeyDown
  ) {
    return;
  }

  state.currentModal = null;
};

export const switchCurrentWorkspaceBySandbox = (
  { state, actions }: Context,
  { sandbox }: { sandbox: Sandbox }
) => {
  if (
    hasPermission(sandbox.authorization, 'owner') &&
    state.user &&
    sandbox.team
  ) {
    actions.setActiveTeam({ id: sandbox.team.id });
  }
};

export const currentSandboxChanged = ({ state, actions }: Context) => {
  const sandbox = state.editor.currentSandbox!;
  actions.internal.switchCurrentWorkspaceBySandbox({
    sandbox,
  });
};

export const setCurrentSandbox = async (
  { state, effects, actions }: Context,
  sandbox: Sandbox
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

    if (defaultModule) {
      currentModuleShortid = defaultModule.shortid;
    }
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

export const closeTabByIndex = ({ state }: Context, tabIndex: number) => {
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

export const getErrorMessage = (
  context: Context,
  { error }: { error: ApiError | Error }
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

export const handleError = (
  { actions, effects, state }: Context,
  {
    message,
    error,
    hideErrorMessage = false,
  }: {
    /*
      The message that will show as title of the notification
    */
    message: string;
    error: ApiError | Error;
    hideErrorMessage?: boolean;
  }
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
  } else if (
    error.message.startsWith(
      'You reached the limit of server sandboxes, we will increase the limit in the future. Please contact support@codesandbox.io for more server sandboxes.'
    )
  ) {
    effects.analytics.track('Patron Server Sandbox Limit Reached', {
      errorMessage: error.message,
    });
  } else if (
    error.message.startsWith(
      'You need to be signed in to fork a server template.'
    ) ||
    error.message.startsWith(
      'You need to be signed in to fork a cloud sandbox.'
    )
  ) {
    notificationActions.primary = {
      label: 'Sign in',
      run: () => {
        state.signInModalOpen = true;
      },
    };
  }

  effects.notificationToast.add({
    title: message,
    message: error.message,
    status: NotificationStatus.ERROR,
    ...(notificationActions.primary ? { actions: notificationActions } : {}),
  });
};

export const trackCurrentTeams = async ({ effects, state }: Context) => {
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

export const identifyCurrentUser = async ({ state, effects }: Context) => {
  const user = state.user;
  if (user) {
    Object.entries(user.metadata).forEach(([key, value]) => {
      if (value) {
        effects.analytics.identify(key, value);
      }
    });

    const profileData = await effects.api.getProfile(user.username);
    effects.analytics.identify('sandboxCount', profileData.sandboxCount);
    effects.analytics.identify('pro', Boolean(profileData.subscriptionSince));
    effects.analytics.identify('receivedViewCount', profileData.viewCount);
  }
};

const VIEW_MODE_DASHBOARD = 'VIEW_MODE_DASHBOARD';
export const setViewModeForDashboard = ({ effects, state }: Context) => {
  const localStorageViewMode = effects.browser.storage.get(VIEW_MODE_DASHBOARD);
  if (localStorageViewMode === 'grid' || localStorageViewMode === 'list') {
    state.dashboard.viewMode = localStorageViewMode;
  }
};

const INVALID_ID_TITLE = 'Workspace not recognized.';
const INVALID_ID_MESSAGE =
  "The workspace in the URL or stored in your browser is unknown. We've automatically switched to your personal workspace.";

// TODO we could rename the function to initializeTeam (because we also use
// personalWorkspaceId);
export const setActiveWorkspaceFromUrlOrStore = async ({
  actions,
  effects,
}: Context) => {
  const { id, isValid } = await actions.internal.getTeamIdFromUrlOrStore();

  if (isValid && id) {
    // Set active team from url or storage.
    actions.setActiveTeam({ id });
  } else {
    // If an id was set but it's not valid we show a toast message informing the user
    // we changed the workspace to the personal workspace. If no id was set we silently
    // activate the personal team.
    if (id) {
      effects.notificationToast.add({
        title: INVALID_ID_TITLE,
        message: INVALID_ID_MESSAGE,
        status: NotificationStatus.NOTICE,
      });
    }

    // Change to personal workspace.
    actions.internal.setActiveTeamFromPersonalWorkspaceId();
  }
};

export const getTeamIdFromUrlOrStore = async ({
  state,
  effects,
  actions,
}: Context): Promise<{ id: string | null; isValid: boolean }> => {
  const suggestedTeamId =
    actions.internal.getTeamIdFromUrl() ||
    actions.internal.getTeamIdFromLocalStorage();
  const hasTeams = state.dashboard?.teams && state.dashboard.teams.length > 0;

  let userTeams: TeamFragmentDashboardFragment[] | undefined;

  if (hasTeams) {
    userTeams = state.dashboard.teams;
  } else {
    // TODO: Instead of actions.dashboard.getTeams();
    // We might be able to use it though, and then use state.dashboard.teams!
    const teams = await effects.gql.queries.getTeams({});

    if (teams?.me) {
      userTeams = teams.me.workspaces;

      // Also set state while we're at it
      state.dashboard.teams = teams.me.workspaces;
      state.personalWorkspaceId = teams.me.personalWorkspaceId;
      state.userCanStartTrial = teams.me.eligibleForTrial;
    }
  }

  const isSuggestedTeamValid = userTeams?.some(
    team => team.id === suggestedTeamId
  );

  return {
    id: suggestedTeamId!,
    isValid: Boolean(isSuggestedTeamValid),
  };
};

export const getTeamIdFromUrl = (): string | null => {
  const url = typeof document === 'undefined' ? null : document.location.href;

  if (url) {
    return new URL(url).searchParams.get('workspace');
  }

  return null;
};

export const getTeamIdFromLocalStorage = ({ effects }): string | null => {
  const localStorageTeamId = effects.browser.storage.get(TEAM_ID_LOCAL_STORAGE);
  const isValidStorageItem = typeof localStorageTeamId === 'string';

  if (isValidStorageItem) {
    return localStorageTeamId;
  }

  return null;
};

/**
 * Function to activate the personal workspace. We call this function when
 * no initial team id is known (from url or localStorage).
 */
export const setActiveTeamFromPersonalWorkspaceId = async ({
  actions,
  state,
  effects,
}: Context) => {
  if (state.personalWorkspaceId) {
    actions.setActiveTeam({ id: state.personalWorkspaceId });
  } else {
    const res = await effects.gql.queries.getPersonalWorkspaceId({});

    if (res.me) {
      actions.setActiveTeam({ id: res.me.personalWorkspaceId });
    }
  }
};

export const replaceWorkspaceParameterInUrl = ({ state }: Context) => {
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
