import { Overmind } from 'overmind';
import { identify } from '@codesandbox/common/lib/utils/analytics';
import {
  NotificationType,
  convertTypeToStatus,
} from '@codesandbox/common/lib/utils/notifications';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';

import { NotificationStatus } from '@codesandbox/notifications';
import { TeamStep } from 'app/pages/Dashboard/Components/NewTeamModal';
import { withLoadApp } from './factories';
import * as internalActions from './internalActions';
import { TEAM_ID_LOCAL_STORAGE } from './utils/team';
import { Context } from '.';
import { DEFAULT_DASHBOARD_SANDBOXES } from './namespaces/dashboard/state';
import { FinalizeSignUpOptions } from './effects/api/types';

export const internal = internalActions;

export const onInitializeOvermind = async (
  { state, effects, actions }: Context,
  overmindInstance: Overmind<Context>
) => {
  const provideJwtToken = () => effects.api.getJWTToken();
  state.isFirstVisit = Boolean(
    !state.hasLogIn && !effects.browser.storage.get('hasVisited')
  );

  effects.browser.storage.set('hasVisited', true);

  effects.live.initialize({
    provideJwtToken,
    onApplyOperation: actions.live.applyTransformation,
    onOperationError: actions.live.onOperationError,
  });

  effects.flows.initialize(overmindInstance.reaction);

  // We consider recover mode something to be done when browser actually crashes, meaning there is no unmount
  effects.browser.onUnload(() => {
    if (state.editor.currentSandbox && state.connected) {
      effects.moduleRecover.clearSandbox(state.editor.currentSandbox.id);
    }
  });

  effects.api.initialize({
    getParsedConfigurations() {
      return state.editor.parsedConfigurations;
    },
    provideJwtToken() {
      if (process.env.LOCAL_SERVER || process.env.STAGING) {
        return localStorage.getItem('devJwt');
      }

      return null;
    },
  });

  const hasDevAuth = process.env.LOCAL_SERVER || process.env.STAGING;
  const gqlOptions: Parameters<typeof effects.gql.initialize>[0] = {
    endpoint: `${location.origin}/api/graphql`,
  };

  if (hasDevAuth) {
    gqlOptions.headers = () => ({
      Authorization: `Bearer ${localStorage.getItem('devJwt')}`,
    });
  }

  effects.gql.initialize(gqlOptions, () => effects.live.socket);

  if (state.hasLogIn) {
    await actions.internal.setActiveTeamFromUrlOrStore();
  }

  effects.notifications.initialize({
    provideSocket() {
      return effects.live.getSocket();
    },
  });

  effects.vercel.initialize({
    getToken() {
      return state.user?.integrations.zeit?.token ?? null;
    },
  });

  effects.netlify.initialize({
    getUserId() {
      return state.user?.id ?? null;
    },
    provideJwtToken() {
      if (process.env.LOCAL_SERVER || process.env.STAGING) {
        return Promise.resolve(localStorage.getItem('devJwt'));
      }

      return provideJwtToken();
    },
  });

  effects.githubPages.initialize({
    provideJwtToken() {
      if (process.env.LOCAL_SERVER || process.env.STAGING) {
        return Promise.resolve(localStorage.getItem('devJwt'));
      }
      return provideJwtToken();
    },
  });

  effects.prettyfier.initialize({
    getCurrentModule() {
      return state.editor.currentModule;
    },
    getPrettierConfig() {
      let config = state.preferences.settings.prettierConfig;
      const configFromSandbox = state.editor.currentSandbox?.modules.find(
        module =>
          module.directoryShortid == null && module.title === '.prettierrc'
      );

      if (configFromSandbox) {
        config = JSON.parse(configFromSandbox.code);
      }

      return config;
    },
  });

  effects.vscode.initialize({
    getCurrentSandbox: () => state.editor.currentSandbox,
    getCurrentModule: () => state.editor.currentModule,
    getSandboxFs: () => state.editor.modulesByPath,
    getCurrentUser: () => state.user,
    onOperationApplied: actions.editor.onOperationApplied,
    onCodeChange: actions.editor.codeChanged,
    onSelectionChanged: selection => {
      actions.editor.onSelectionChanged(selection);
      actions.live.onSelectionChanged(selection);
    },
    onViewRangeChanged: actions.live.onViewRangeChanged,
    onCommentClick: actions.comments.onCommentClick,
    reaction: overmindInstance.reaction,
    getState: (path: string) =>
      path ? path.split('.').reduce((aggr, key) => aggr[key], state) : state,
    getSignal: (path: string) =>
      path.split('.').reduce((aggr, key) => aggr[key], actions),
  });

  effects.preview.initialize();

  actions.internal.showPrivacyPolicyNotification();
  actions.internal.setViewModeForDashboard();

  effects.browser.onWindowMessage(event => {
    if (event.data.type === 'screenshot-requested-from-preview') {
      actions.preview.createPreviewComment();
    }
  });

  effects.browserExtension.hasExtension().then(hasExtension => {
    actions.preview.setExtension(hasExtension);
  });
};

export const appUnmounted = async ({ effects, actions }: Context) => {
  effects.connection.removeListener(actions.connectionChanged);
};

export const sandboxPageMounted = withLoadApp();

export const searchMounted = withLoadApp();

export const codesadboxMounted = withLoadApp();

export const genericPageMounted = withLoadApp();

export const getPendingUser = async ({ state, effects }: Context) => {
  if (!state.pendingUserId) return;
  const pendingUser = await effects.api.getPendingUser(state.pendingUserId);
  if (!pendingUser) return;
  state.pendingUser = {
    ...pendingUser,
    valid: true,
  };
};

export const cliMounted = withLoadApp(async ({ state, actions }: Context) => {
  if (state.user) {
    await actions.internal.authorize();
  }
});

export const notificationAdded = (
  { effects }: Context,
  {
    title,
    notificationType,
    timeAlive,
  }: {
    title: string;
    notificationType: NotificationType;
    timeAlive?: number;
  }
) => {
  effects.notificationToast.add({
    message: title,
    status: convertTypeToStatus(notificationType),
    timeAlive: timeAlive ? timeAlive * 1000 : undefined,
  });
};

export const notificationRemoved = (
  { state }: Context,
  {
    id,
  }: {
    id: number;
  }
) => {
  const { notifications } = state;
  const notificationToRemoveIndex = notifications.findIndex(
    notification => notification.id === id
  );

  state.notifications.splice(notificationToRemoveIndex, 1);
};

export const cliInstructionsMounted = withLoadApp();

export const githubPageMounted = withLoadApp();

export const connectionChanged = ({ state }: Context, connected: boolean) => {
  state.connected = connected;
};

type ModalName =
  | 'githubPagesLogs'
  | 'deleteWorkspace'
  | 'deleteDeployment'
  | 'deleteSandbox'
  | 'feedback'
  | 'forkServerModal'
  | 'liveSessionEnded'
  | 'netlifyLogs'
  | 'preferences'
  | 'searchDependencies'
  | 'share'
  | 'signInForTemplates'
  | 'userSurvey'
  | 'liveSessionEnded'
  | 'sandboxPicker'
  | 'minimumPrivacy'
  | 'addMemberToWorkspace'
  | 'legacyPayment';

export const modalOpened = (
  { state, effects }: Context,
  props: {
    modal: ModalName;
    message?: string;
    itemId?: string;
  }
) => {
  effects.analytics.track('Open Modal', { modal: props.modal });
  state.currentModal = props.modal;
  if (props.modal === 'preferences' && props.itemId) {
    state.preferences.itemId = props.itemId;
  } else {
    state.currentModalMessage = props.message || null;
  }
};

export const modalClosed = ({ state }: Context) => {
  state.currentModal = null;
};

export const signInClicked = (
  { state }: Context,
  props: { onCancel: () => void | null } | null
) => {
  state.signInModalOpen = true;
  state.cancelOnLogin = props?.onCancel ?? null;
};

export const signInWithRedirectClicked = (
  { state }: Context,
  redirectTo: string
) => {
  state.signInModalOpen = true;
  state.redirectOnLogin = redirectTo;
};

export const toggleSignInModal = ({ state }: Context) => {
  if (state.signInModalOpen) {
    state.cancelOnLogin = null;
  }
  state.signInModalOpen = !state.signInModalOpen;
};

export const signInButtonClicked = async (
  { actions, state }: Context,
  options: {
    useExtraScopes?: boolean;
    provider: 'apple' | 'google' | 'github';
  }
) => {
  const { useExtraScopes, provider } = options || {};
  if (!useExtraScopes) {
    await actions.internal.signIn({
      provider,
      useExtraScopes: false,
    });
    state.signInModalOpen = false;
    state.cancelOnLogin = null;
    return;
  }
  await actions.internal.signIn({
    useExtraScopes,
    provider,
  });
  state.signInModalOpen = false;
  state.cancelOnLogin = null;
};

export const addNotification = (
  { effects }: Context,
  {
    message,
    type,
    timeAlive,
  }: {
    message: string;
    type: NotificationType;
    timeAlive: number;
  }
) => {
  effects.notificationToast.add({
    message,
    status: effects.notificationToast.convertTypeToStatus(type),
    timeAlive: timeAlive * 1000,
  });
};

export const removeNotification = ({ state }: Context, id: number) => {
  const notificationToRemoveIndex = state.notifications.findIndex(
    notification => notification.id === id
  );

  state.notifications.splice(notificationToRemoveIndex, 1);
};

export const signInVercelClicked = async ({
  state,
  effects: { browser, api, notificationToast },
  actions,
}: Context) => {
  state.isLoadingVercel = true;
  const popup = browser.openPopup('/auth/zeit', 'sign in');
  const data: { code: string } = await browser.waitForMessage('signin');

  popup.close();

  if (data && data.code) {
    try {
      state.user = await api.createVercelIntegration(data.code);
      await actions.deployment.internal.getVercelUserDetails();
    } catch (error) {
      actions.internal.handleError({
        message: 'Could not authorize with Vercel',
        error,
      });
    }
  } else {
    notificationToast.error('Could not authorize with Vercel');
  }

  state.isLoadingVercel = false;
};

export const signOutVercelClicked = async ({ state, effects }: Context) => {
  if (state.user?.integrations?.zeit) {
    await effects.api.signoutVercel();
    state.user.integrations.zeit = null;
  }
};

export const authTokenRequested = async ({ actions }: Context) => {
  await actions.internal.authorize();
};

export const requestAuthorisation = async ({ actions }: Context) => {
  await actions.internal.authorize();
};

export const setPendingUserId = ({ state }: Context, id: string) => {
  state.pendingUserId = id;
};

export const signInGithubClicked = async ({ state, actions }: Context) => {
  state.isLoadingGithub = true;
  await actions.internal.signIn({ useExtraScopes: true, provider: 'github' });
  state.isLoadingGithub = false;
  if (state.editor.currentSandbox?.originalGit) {
    actions.git.loadGitSource();
  }
};

export const signInGoogleClicked = async ({ actions }: Context) => {
  await actions.internal.signIn({ provider: 'google' });
};

export const signInAppleClicked = async ({ actions }: Context) => {
  await actions.internal.signIn({ provider: 'apple' });
};

export const signOutClicked = async ({ state, effects, actions }: Context) => {
  effects.analytics.track('Sign Out', {});
  state.workspace.openedWorkspaceItem = 'files';
  if (state.live.isLive) {
    actions.live.internal.disconnect();
  }
  await effects.api.signout();
  identify('signed_in', false);
  document.cookie = 'signedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie =
    'signedInDev=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  state.hasLogIn = false;
  state.user = null;
  state.sandboxesLimits = null;
  effects.browser.reload();
};

export const signOutGithubIntegration = async ({ state, effects }: Context) => {
  if (state.user?.integrations?.github) {
    await effects.api.signoutGithubIntegration();
    state.user.integrations.github = null;
  }
};

export const setUpdateStatus = (
  { state }: Context,
  { status }: { status: string }
) => {
  state.updateStatus = status;
};

export const track = (
  { effects }: Context,
  { name, data }: { name: string; data: any }
) => {
  effects.analytics.track(name, data);
};

export const refetchSandboxInfo = async ({
  actions,
  effects,
  state,
}: Context) => {
  const sandbox = state.editor.currentSandbox;

  if (!sandbox?.id) {
    return;
  }

  const updatedSandbox = await effects.api.getSandbox(sandbox.id);

  sandbox.collection = updatedSandbox.collection;
  sandbox.owned = updatedSandbox.owned;
  sandbox.userLiked = updatedSandbox.userLiked;
  sandbox.title = updatedSandbox.title;
  sandbox.description = updatedSandbox.description;
  sandbox.team = updatedSandbox.team;
  sandbox.roomId = updatedSandbox.roomId;
  sandbox.authorization = updatedSandbox.authorization;
  sandbox.privacy = updatedSandbox.privacy;
  sandbox.featureFlags = updatedSandbox.featureFlags;
  sandbox.npmRegistries = updatedSandbox.npmRegistries;

  await actions.editor.internal.initializeSandbox(sandbox);
};

export const acceptTeamInvitation = (
  { effects, actions }: Context,
  {
    teamName,
  }: {
    teamName: string;
    teamId: string;
  }
) => {
  effects.analytics.track('Team - Join Team', { source: 'invitation' });
  effects.analytics.track('Team - Invitation Accepted', {});

  actions.internal.trackCurrentTeams();

  effects.notificationToast.success(`Accepted invitation to ${teamName}`);
};

export const rejectTeamInvitation = (
  { effects }: Context,
  { teamName }: { teamName: string }
) => {
  effects.analytics.track('Team - Invitation Rejected', {});

  effects.notificationToast.success(`Rejected invitation to ${teamName}`);
};

export const setActiveTeam = async (
  { state, actions, effects }: Context,
  {
    id,
  }: {
    id: string;
  }
) => {
  // ignore if its already selected
  if (id === state.activeTeam) return;

  state.activeTeam = id;
  effects.browser.storage.set(TEAM_ID_LOCAL_STORAGE, id);

  // reset dashboard data on team change
  state.dashboard.sandboxes = { ...DEFAULT_DASHBOARD_SANDBOXES };
  state.dashboard.contributions = null;

  actions.internal.replaceWorkspaceParameterInUrl();

  if (state.activeTeamInfo?.id !== id) {
    try {
      await actions.getActiveTeamInfo();
    } catch (e) {
      let personalWorkspaceId = state.personalWorkspaceId;
      if (!personalWorkspaceId) {
        const res = await effects.gql.queries.getPersonalWorkspaceId({});
        personalWorkspaceId = res.me?.personalWorkspaceId;
      }
      if (personalWorkspaceId) {
        effects.notificationToast.add({
          title: 'Could not find current workspace',
          message: "We've switched you to your personal workspace",
          status: NotificationStatus.WARNING,
        });
        // Something went wrong while fetching the workspace
        actions.setActiveTeam({ id: personalWorkspaceId! });
      }
    }
  }

  actions.internal.trackCurrentTeams();
};

export const getActiveTeamInfo = async ({
  state,
  effects,
  actions,
}: Context) => {
  if (!state.activeTeam) {
    await actions.internal.setActiveTeamFromUrlOrStore();
  }

  const team = await effects.gql.queries.getTeam({
    teamId: state.activeTeam,
  });

  const currentTeam = team?.me?.team;

  if (!currentTeam) {
    return null;
  }

  state.activeTeamInfo = currentTeam;

  return currentTeam;
};

export const openCreateSandboxModal = (
  { actions }: Context,
  props: {
    collectionId?: string;
    initialTab?: 'import';
  }
) => {
  actions.modals.newSandboxModal.open(props);
};

type OpenCreateTeamModalParams = {
  step: TeamStep;
};
export const openCreateTeamModal = (
  { actions }: Context,
  props?: OpenCreateTeamModalParams
) => {
  actions.modals.newTeamModal.open({ step: props?.step ?? 'info' });
};

export const validateUsername = async (
  { effects, state }: Context,
  userName: string
) => {
  if (!state.pendingUser) return;
  const validity = await effects.api.validateUsername(userName);

  state.pendingUser.valid = validity.available;
};

type SignUpOptions = Omit<FinalizeSignUpOptions, 'id'>;
export const finalizeSignUp = async (
  { effects, actions, state }: Context,
  { username, name, role, usage }: SignUpOptions
) => {
  if (!state.pendingUser) return;
  try {
    await effects.api.finalizeSignUp({
      id: state.pendingUser.id,
      username,
      name,
      role,
      usage,
    });
    window.postMessage(
      {
        type: 'signin',
      },
      protocolAndHost()
    );
  } catch (error) {
    actions.internal.handleError({
      message: 'There was a problem creating your account',
      error,
    });
  }
};

export const setLoadingAuth = async (
  { state }: Context,
  provider: 'apple' | 'google' | 'github'
) => {
  state.loadingAuth[provider] = !state.loadingAuth[provider];
};

export const getSandboxesLimits = async ({ effects, state }: Context) => {
  const limits = await effects.api.sandboxesLimits();

  state.sandboxesLimits = limits;
};

export const openCancelSubscriptionModal = ({ state }: Context) => {
  state.currentModal = 'subscriptionCancellation';
};
