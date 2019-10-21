import {
  NotificationType,
  convertTypeToStatus,
} from '@codesandbox/common/lib/utils/notifications';

import { withLoadApp } from './factories';
import * as internalActions from './internalActions';
import { Action, AsyncAction } from '.';

export const internal = internalActions;

export const appUnmounted: AsyncAction = async ({ effects, actions }) => {
  effects.connection.removeListener(actions.connectionChanged);
};

export const sandboxPageMounted: AsyncAction = withLoadApp();

export const searchMounted: AsyncAction = withLoadApp();

export const codesadboxMounted: AsyncAction = withLoadApp();

export const cliMounted: AsyncAction = withLoadApp(
  async ({ state, actions }) => {
    if (state.user) {
      await actions.internal.authorize();
    }
  }
);

export const notificationAdded: Action<{
  title: string;
  notificationType: NotificationType;
  timeAlive?: number;
}> = ({ effects }, { title, notificationType, timeAlive = 1 }) => {
  effects.notificationToast.add({
    message: title,
    status: convertTypeToStatus(notificationType),
    timeAlive: timeAlive * 1000,
  });
};

export const notificationRemoved: Action<{
  id: number;
}> = ({ state }, { id }) => {
  const { notifications } = state;
  const notificationToRemoveIndex = notifications.findIndex(
    notification => notification.id === id
  );

  state.notifications.splice(notificationToRemoveIndex, 1);
};

export const forceRender: Action = ({ state }) => {
  state.editor.forceRender++;
};

export const cliInstructionsMounted: AsyncAction = withLoadApp();

export const githubPageMounted: AsyncAction = withLoadApp();

export const connectionChanged: Action<boolean> = ({ state }, connected) => {
  state.connected = connected;
};

type ModalName =
  | 'deleteDeployment'
  | 'deleteSandbox'
  | 'feedback'
  | 'forkServerModal'
  | 'liveSessionEnded'
  | 'moveSandbox'
  | 'netlifyLogs'
  | 'newSandbox'
  | 'preferences'
  | 'privacyServerWarning'
  | 'share'
  | 'searchDependencies'
  | 'signInForTemplates';
export const modalOpened: Action<{ modal: ModalName; message?: string }> = (
  { state, effects },
  { modal, message }
) => {
  effects.analytics.track('Open Modal', { modal });
  state.currentModalMessage = message;
  state.currentModal = modal;
};

export const modalClosed: Action = ({ state, effects }) => {
  // We just start it whenever it closes, if already started nothing happens
  if (state.currentModal === 'preferences') {
    effects.keybindingManager.start();
  }

  state.currentModal = null;
};

export const signInClicked: AsyncAction<{ useExtraScopes: boolean }> = (
  { actions },
  options
) => actions.internal.signIn(options);

export const signInCliClicked: AsyncAction = async ({ state, actions }) => {
  await actions.internal.signIn({
    useExtraScopes: false,
  });

  if (state.user) {
    await actions.internal.authorize();
  }
};

export const addNotification: Action<{
  message: string;
  type: NotificationType;
  timeAlive: number;
}> = ({ effects }, { message, type, timeAlive }) => {
  effects.notificationToast.add({
    message,
    status: effects.notificationToast.convertTypeToStatus(type),
    timeAlive: timeAlive * 1000,
  });
};

export const removeNotification: Action<number> = ({ state }, id) => {
  const notificationToRemoveIndex = state.notifications.findIndex(
    notification => notification.id === id
  );

  state.notifications.splice(notificationToRemoveIndex, 1);
};

export const signInZeitClicked: AsyncAction = async ({
  state,
  effects: { browser, api, notificationToast },
  actions,
}) => {
  state.isLoadingZeit = true;

  const popup = browser.openPopup('/auth/zeit', 'sign in');
  const data: { code: string } = await browser.waitForMessage('signin');

  popup.close();

  if (data && data.code) {
    try {
      state.user = await api.createZeitIntegration(data.code);
      await actions.deployment.internal.getZeitUserDetails();
    } catch (error) {
      notificationToast.error('Could not authorize with ZEIT');
    }
  } else {
    notificationToast.error('Could not authorize with ZEIT');
  }

  state.isLoadingZeit = false;
};

export const signOutZeitClicked: AsyncAction = async ({ state, effects }) => {
  await effects.http.delete(`/users/current_user/integrations/zeit`);
  state.user.integrations.zeit = null;
};

export const authTokenRequested: AsyncAction = async ({ actions }) => {
  await actions.internal.authorize();
};

export const requestAuthorisation: AsyncAction = async ({ actions }) => {
  await actions.internal.authorize();
};

export const signInGithubClicked: AsyncAction = async ({ state, actions }) => {
  state.isLoadingGithub = true;
  await actions.internal.signIn({ useExtraScopes: true });
  state.isLoadingGithub = false;
};

export const signOutClicked: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  effects.analytics.track('Sign Out', {});
  state.workspace.openedWorkspaceItem = 'files';
  if (state.live.isLive) {
    actions.live.internal.disconnect();
  }
  await effects.api.signout();
  effects.jwt.reset();
  state.user = null;
  effects.browser.reload();
};

export const signOutGithubIntegration: AsyncAction = async ({
  state,
  effects,
}) => {
  await effects.api.signoutGithubIntegration();
  state.user.integrations.github = null;
};

export const setUpdateStatus: Action<{ status: string }> = (
  { state },
  { status }
) => {
  state.updateStatus = status;
};

export const track: Action<{ name: string; data: any }> = (
  { effects },
  { name, data }
) => {
  effects.analytics.track(name, data);
};

export const refetchSandboxInfo: AsyncAction = async ({
  state,
  effects,
  actions,
}) => {
  if (state.editor.currentId) {
    const id = state.editor.currentId;
    const sandbox = state.editor.currentSandbox;
    const updatedSandbox = await effects.api.getSandbox(id);

    sandbox.collection = updatedSandbox.collection;
    sandbox.owned = updatedSandbox.owned;
    sandbox.userLiked = updatedSandbox.userLiked;
    sandbox.title = updatedSandbox.title;
    sandbox.team = updatedSandbox.team;
    sandbox.roomId = updatedSandbox.roomId;

    await actions.editor.internal.initializeLiveSandbox(sandbox);
  }
};

export const acceptTeamInvitation: Action<{ teamName: string }> = (
  { effects },
  { teamName }
) => {
  effects.analytics.track('Team - Invitation Accepted', {});

  effects.notificationToast.success(`Accepted invitation to ${teamName}`);
};

export const rejectTeamInvitation: Action<{ teamName: string }> = (
  { effects },
  { teamName }
) => {
  effects.analytics.track('Team - Invitation Accepted', {});

  effects.notificationToast.success(`Rejected invitation to ${teamName}`);
};
