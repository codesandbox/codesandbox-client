import { NotificationButton, Sandbox } from '@codesandbox/common/lib/types';
import history from 'app/utils/history';
import { NotificationMessage } from '@codesandbox/notifications/lib/state';
import { NotificationStatus } from '@codesandbox/notifications';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import values from 'lodash-es/values';

import { SubscriptionStatus } from 'app/graphql/types';
import {
  GithubTemplate,
  OfficialTemplatesResponseType,
  SandboxToFork,
} from 'app/components/Create/utils/types';
import { ApiError } from './effects/api/apiFactory';
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
  effects.analytics.identify('signed_in', true);
  effects.analytics.setUserId(state.user!.id, state.user!.email);

  try {
    actions.internal.trackCurrentTeams().catch(e => {});
    actions.internal.identifyCurrentUser().catch(e => {});
  } catch (e) {
    // Not majorly important
  }

  actions.internal.showUserSurveyIfNeeded();
  actions.internal.showUpdatedToSIfNeeded();
  actions.userNotifications.internal.initialize();
  actions.internal.setStoredSettings();

  if (state.activeTeam) {
    effects.api.preloadTeamTemplates(state.activeTeam);
  }

  // Fallback scenario when the teams are not initialized
  if (state.dashboard.teams.length === 0) {
    await actions.dashboard.getTeams();
  }
};

export const signIn = async (
  { state, effects, actions }: Context,
  options: AuthOptions
) => {
  effects.analytics.track('Sign In', {
    provider: options.provider,
    scope: options.provider === 'github' ? options.includedScopes : '',
  });
  try {
    await actions.internal.runProviderAuth(options);

    state.signInModalOpen = false;
    state.cancelOnLogin = null;
    state.pendingUser = null;

    const currentUser = await effects.api.getCurrentUser();
    state.user = renameZeitToVercel(currentUser);

    await actions.internal.initializeNewUser();
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

// TODO: Replace this with a browserSandboxId field in the github repo
const DEVBOX_SANDBOX_ID_MAP = {
  '9qputt': 'react-ts',
  '7rp8q9': 'vanilla-ts',
  '3l5fg9': 'vanilla',
  kmwy42: 'rjk9n4zj7m', // Html + CSS
};

export const prefetchOfficialTemplates = async ({ state }: Context) => {
  // Preload official devbox templates for the create modal
  if (state.officialTemplates.length === 0) {
    try {
      // First query the templates from github / sandbox-templates
      const githubTemplatesResponse = (await fetch(
        'https://raw.githubusercontent.com/codesandbox/sandbox-templates/main/templates.json'
      ).then(res => res.json())) as GithubTemplate[];

      const githubTemplates: SandboxToFork[] = githubTemplatesResponse.map(
        template => ({
          id: template.id,
          title: template.title,
          alias: template.title,
          description: template.description,
          tags: [...template.tags, 'server']
            .concat(
              DEVBOX_SANDBOX_ID_MAP[template.id]
                ? ['browser', 'playground', 'frontend']
                : []
            )
            .concat(
              DEVBOX_SANDBOX_ID_MAP[template.id]?.endsWith('-ts')
                ? ['typescript']
                : []
            ),
          editorUrl: template.editorUrl,
          type: 'devbox',
          forkCount: template.forkCount,
          viewCount: template.viewCount,
          iconUrl: template.iconUrl,
          author: 'CodeSandbox',
          browserSandboxId: DEVBOX_SANDBOX_ID_MAP[template.id],
        })
      );

      const apiResponse = (await fetch(
        '/api/v1/sandboxes/templates/official'
      ).then(res => res.json())) as OfficialTemplatesResponseType;

      // Query the db sandbox templates to fill in with templates that are browser-only
      const browserOnlyTemplates: SandboxToFork[] = apiResponse[0].sandboxes
        .filter(s => !s.v2)
        // Filter out sandbox templates that are associated with devboxes
        .filter(s => !Object.values(DEVBOX_SANDBOX_ID_MAP).includes(s.id))
        .map(template => ({
          id: template.id,
          title: template.title,
          alias: template.alias,
          description: template.description,
          tags: ['browser', 'playground', 'frontend'].concat(
            template.id.endsWith('-ts') ? ['typescript'] : []
          ),
          type: 'sandbox',
          forkCount: template.fork_count,
          viewCount: template.view_count,
          iconUrl: template.custom_template.icon_url,
          sourceTemplate: template.environment,
          author: 'CodeSandbox',
        }));

      const templates = [...githubTemplates, ...browserOnlyTemplates];

      // Sort templates by fork count
      templates.sort((s1, s2) => s2.forkCount - s1.forkCount);

      state.officialTemplates = templates;
    } catch (e) {
      // ignore errors
    }
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

export const showUpdatedToSIfNeeded = ({ state, effects }: Context) => {
  const registrationDate = state.user?.insertedAt
    ? new Date(state.user.insertedAt)
    : new Date();

  // If we're in an iframe, don't show notification
  try {
    if (window.self !== window.top) {
      return;
    }
  } catch (e) {
    // Ignore errors
  }

  if (registrationDate >= new Date('2024-03-10')) {
    // This means that the user has registered before we updated the ToS, and we need to notify
    // them that the ToS has changed.
    return;
  }

  const hasShownToS = effects.browser.storage.get('TOS_1_SHOWN');
  if (hasShownToS) {
    return;
  }

  effects.browser.storage.set('TOS_1_SHOWN', true);

  effects.notificationToast.add({
    title: 'Terms of Service Updated',
    message: "We've updated our Terms of Service.",
    status: NotificationStatus.NOTICE,
    sticky: true,

    actions: {
      primary: {
        label: 'Open Terms of Service',
        run: () => {
          window.open('https://codesandbox.io/legal/terms', '_blank');
        },
      },
    },
  });
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

export const initializeActiveWorkspace = async ({
  actions,
  state,
  effects,
}: Context) => {
  const persistedWorkspaceId = actions.internal.getTeamIdFromUrlOrStore();

  const hasWorkspaces =
    state.dashboard?.teams && state.dashboard.teams.length > 0;
  if (!hasWorkspaces) {
    const teams = await effects.gql.queries.getTeams({});

    if (teams?.me) {
      state.dashboard.teams = teams.me.workspaces;
      state.primaryWorkspaceId = teams.me.primaryWorkspaceId;
    }

    // Hard redirect to /create-workspace when no workspace is available
    if (
      !window.location.href.includes('/create-workspace') &&
      state.dashboard.teams.length === 0
    ) {
      window.location.href = '/create-workspace';
    }
  }

  const isPersistedWorkspaceValid = state.dashboard.teams.some(
    team => team.id === persistedWorkspaceId
  );

  if (isPersistedWorkspaceValid && persistedWorkspaceId) {
    // Set active team from url or storage.
    actions.setActiveTeam({ id: persistedWorkspaceId });
  } else {
    actions.internal.setFallbackWorkspace();
  }
};

export const setFallbackWorkspace = ({ actions, state }: Context) => {
  if (state.primaryWorkspaceId) {
    actions.setActiveTeam({ id: state.primaryWorkspaceId });
  } else {
    const firstWorkspace =
      state.dashboard.teams.length > 0 ? state.dashboard.teams[0] : null;
    const firstProWorkspace = state.dashboard.teams.find(
      team => team.subscription?.status === SubscriptionStatus.Active
    );

    if (firstProWorkspace) {
      actions.setActiveTeam({ id: firstProWorkspace.id });
    } else if (firstWorkspace) {
      actions.setActiveTeam({ id: firstWorkspace.id });
    } else {
      // TODO: Redirect to workspace setup
      // https://linear.app/codesandbox/issue/PC-1341/handle-empty-state-for-primary-workspaces
    }
  }
};

export const getTeamIdFromUrlOrStore = ({
  actions,
}: Context): string | null => {
  return (
    actions.internal.getTeamIdFromUrl() ||
    actions.internal.getTeamIdFromLocalStorage()
  );
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
