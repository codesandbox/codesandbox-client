import { Overmind } from 'overmind';
import { identify } from '@codesandbox/common/lib/utils/analytics';
import {
  NotificationType,
  convertTypeToStatus,
} from '@codesandbox/common/lib/utils/notifications';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';
import { Sandbox } from '@codesandbox/common/lib/types';

import { withLoadApp } from './factories';
import * as internalActions from './internalActions';
import { TEAM_ID_LOCAL_STORAGE } from './utils/team';
import { Context } from '.';
import { DEFAULT_DASHBOARD_SANDBOXES } from './namespaces/dashboard/state';
import { FinalizeSignUpOptions } from './effects/api/types';
import { AuthOptions, GHScopeOption } from './utils/auth';

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
  });

  effects.flows.initialize(overmindInstance.reaction);

  effects.api.initialize({
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
      'x-codesandbox-client': 'legacy-web',
    });
  } else {
    gqlOptions.headers = () => ({
      'x-codesandbox-client': 'legacy-web',
    });
  }

  effects.gql.initialize(gqlOptions, () => effects.live.socket);

  if (state.hasLogIn) {
    await actions.internal.initializeActiveWorkspace();
  }

  effects.notifications.initialize({
    provideSocket() {
      return effects.live.getSocket();
    },
  });

  actions.internal.setViewModeForDashboard();

  try {
    state.features = await effects.api.getFeatures();
  } catch {
    // Just for safety so it doesn't crash the overmind initialize flow
  }
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
  | 'feedback'
  | 'preferences'
  | 'userSurvey'
  | 'sandboxPicker'
  | 'minimumPrivacy'
  | 'import'
  | 'create';

export const modalOpened = (
  { state, effects }: Context,
  props: {
    modal: ModalName;
    message?: string;
    itemId?: string;
    repoToImport?: { owner: string; name: string };
    sandboxIdToFork?: string;
  }
) => {
  effects.analytics.track('Open Modal', { modal: props.modal });
  state.currentModal = props.modal;
  if (props.modal === 'preferences' && props.itemId) {
    state.preferences.itemId = props.itemId;
  }
  if (props.modal === 'create') {
    state.currentModalItemId = props.itemId;
    state.sandboxIdToFork = props.sandboxIdToFork || null;
  } else {
    state.currentModalMessage = props.message || null;
  }

  if (props.modal === 'import') {
    state.repoToImport = props.repoToImport || null;
  }
};

export const modalClosed = ({ state }: Context) => {
  state.currentModal = null;
  state.currentModalMessage = null;
  state.repoToImport = null;
  state.sandboxIdToFork = null;
};

export const signInClicked = (
  { state }: Context,
  props: { onCancel: () => void | null } | null
) => {
  state.signInModalOpen = true;
  state.cancelOnLogin = props?.onCancel ?? null;
};

export const toggleSignInModal = ({ state }: Context) => {
  if (state.signInModalOpen) {
    state.cancelOnLogin = null;
  }
  state.signInModalOpen = !state.signInModalOpen;
};

export const signInButtonClicked = async (
  { actions, state }: Context,
  options: AuthOptions
) => {
  await actions.internal.signIn(options);
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

export const authTokenRequested = async ({ actions }: Context) => {
  await actions.internal.authorize();
};

export const requestAuthorisation = async ({ actions }: Context) => {
  await actions.internal.authorize();
};

export const setPendingUserId = ({ state }: Context, id: string) => {
  state.pendingUserId = id;
};

export const signInGithubClicked = async (
  { state, actions }: Context,
  includedScopes: GHScopeOption
) => {
  state.isLoadingGithub = true;
  await actions.internal.signIn({ includedScopes, provider: 'github' });
  state.isLoadingGithub = false;
};

export const signOutClicked = async ({ state, effects, actions }: Context) => {
  effects.analytics.track('Sign Out', {});
  await effects.api.signout();
  effects.browser.storage.remove(TEAM_ID_LOCAL_STORAGE);
  effects.router.clearWorkspaceId();

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
      // Reset the active workspace if something goes wrong
      actions.internal.setFallbackWorkspace();
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
    await actions.internal.initializeActiveWorkspace();
  }

  // The getTeam query below used to fail because we weren't sure if the id in
  // the localStorage or url was valid. We check this now when initializing the
  // team, so this shouldn't error anymore.
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
  options: SignUpOptions
) => {
  if (!state.pendingUser) return;
  try {
    const { primaryTeamId } = await effects.api.finalizeSignUp({
      id: state.pendingUser.id,
      ...options,
    });

    state.newUserFirstWorkspaceId = primaryTeamId;

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
  provider: 'apple' | 'google' | 'github' | 'sso'
) => {
  state.loadingAuth[provider] = !state.loadingAuth[provider];
};

export const getSandboxesLimits = async ({ effects, state }: Context) => {
  const limits = await effects.api.sandboxesLimits();

  state.sandboxesLimits = limits;
};

export const clearNewUserFirstWorkspaceId = ({ state }: Context) => {
  state.newUserFirstWorkspaceId = null;
};

export const gotUploadedFiles = async (
  { state, actions, effects }: Context,
  message: string
) => {
  const modal = 'storageManagement';
  effects.analytics.track('Open Modal', { modal });
  state.currentModalMessage = message;
  state.currentModal = modal;

  try {
    const uploadedFilesInfo = await effects.api.getUploads();

    state.uploadedFiles = uploadedFilesInfo.uploads;
    state.maxStorage = uploadedFilesInfo.maxSize;
    state.usedStorage = uploadedFilesInfo.currentSize;
  } catch (error) {
    actions.internal.handleError({
      message: 'Unable to get uploaded files information',
      error,
    });
  }
};

export const createRepoFiles = ({ effects }: Context, sandbox: Sandbox) => {
  return effects.git.export(sandbox);
};

export const deleteUploadedFile = async (
  { actions, effects, state }: Context,
  id: string
) => {
  if (!state.uploadedFiles) {
    return;
  }
  const index = state.uploadedFiles.findIndex(file => file.id === id);
  const removedFiles = state.uploadedFiles.splice(index, 1);

  try {
    await effects.api.deleteUploadedFile(id);
  } catch (error) {
    state.uploadedFiles.splice(index, 0, ...removedFiles);
    actions.internal.handleError({
      message: 'Unable to delete uploaded file',
      error,
    });
  }
};
