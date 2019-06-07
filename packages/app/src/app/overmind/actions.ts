import { Action, AsyncAction } from '.';
import * as internalActions from './internalActions';
import { withLoadApp } from './factories';
import { NotificationType } from '@codesandbox/common/lib/utils/notifications';

export const internal = internalActions;

export const appUnmounted: AsyncAction = async ({ effects, actions }) => {
  effects.connection.removeListener(actions.connectionChanged);
};

export const sandboxPageMounted: AsyncAction = withLoadApp();

export const searchMounted: AsyncAction = withLoadApp();

export const cliMounted: AsyncAction = withLoadApp(
  async ({ state, actions }) => {
    if (state.user) {
      await actions.internal.authorize();
    }
  }
);

export const cliInstructionsMounted: AsyncAction = withLoadApp();

export const githubPageMounted: AsyncAction = withLoadApp();

export const connectionChanged: Action<boolean> = ({ state }, connected) => {
  state.connected = connected;
};

export const modalOpened: Action<{ modal: string; message: string }> = (
  { state, effects },
  { modal, message }
) => {
  effects.analytics.track('Open Modal', { modal });
  state.currentModalMessage = message;
  state.currentModal = modal;
};

export const modalClosed: Action = ({ state }) => {
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

export const userMenuOpened: Action = ({ state }) => {
  state.userMenuOpen = true;
};

export const userMenuClosed: Action = ({ state }) => {
  state.userMenuOpen = false;
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
      state.user = await api.post(`/users/current_user/integrations/zeit`, {
        code: data.code,
      });
      await actions.internal.getZeitUserDetails();
    } catch (error) {
      notificationToast.add({
        message: 'Could not authorize with ZEIT',
        status: notificationToast.convertTypeToStatus('error'),
      });
    }
  } else {
    notificationToast.add({
      message: 'Could not authorize with ZEIT',
      status: notificationToast.convertTypeToStatus('error'),
    });
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
  await actions.internal.signIn({ useExtraScopes: false });
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
  await effects.api.delete(`/users/signout`);
  actions.internal.removeJwtFromStorage();
  state.user = null;
  await actions.refetchSandboxInfo();
};

export const signOutGithubIntegration: AsyncAction = async ({
  state,
  effects,
}) => {
  await effects.api.delete(`/users/current_user/integrations/github`);
  state.user.integrations.github = null;
};

export const setUpdateStatus: Action<string> = ({ state }, status) => {
  state.updateStatus = status;
};

export const refetchSandboxInfo: AsyncAction = async ({ state, actions }) => {
  if (state.editor.currentId) {
    const id = state.editor.currentId;
    const sandbox = await actions.internal.getSandbox(id);

    state.editor.sandboxes[id].collection = sandbox.collection;
    state.editor.sandboxes[id].owned = sandbox.owned;
    state.editor.sandboxes[id].userLiked = sandbox.userLiked;
    state.editor.sandboxes[id].title = sandbox.title;
  }
};

export const track: Action<{ name: string; data: any }> = (
  { effects },
  { name, data }
) => {
  effects.analytics.track(name, data);
};
