import { AsyncAction, Action } from 'app/overmind';
import { client } from 'app/graphql/client';
import gql from 'graphql-tag';
import * as internalActions from './internalActions';

export const internal = internalActions;

export const notificationsOpenedOld: AsyncAction = async ({ state }) => {
  state.userNotifications.notificationsOpened = true;
  state.userNotifications.unreadCount = 0;

  await client.mutate({
    mutation: gql`
      mutation ClearNotificationCount {
        clearNotificationCount {
          id
        }
      }
    `,
  });

  setTimeout(async () => {
    await client.mutate({
      mutation: gql`
        mutation MarkNotificationsAsRead {
          markAllNotificationsAsRead {
            id
          }
        }
      `,
    });
  }, 500);
};

export const notificationsOpened: AsyncAction = async ({ state }) => {
  state.userNotifications.notificationsOpened = true;
};

export const messageReceived: Action<{ event: string }> = (
  { state },
  { event }
) => {
  if (event === 'new-notification') {
    state.userNotifications.unreadCount++;
  }
};

export const notificationsClosed: Action = ({ state }) => {
  state.userNotifications.notificationsOpened = false;
};

export const markAllNotificationsAsRead: AsyncAction = async ({
  state,
  effects,
}) => {
  if (!state.userNotifications.notifications) return;
  const oldNotifications = state.userNotifications.notifications;
  const count = state.userNotifications.unreadCount;
  try {
    state.userNotifications.notifications = state.userNotifications.notifications.map(
      notification => ({
        ...notification,
        read: true,
      })
    );
    state.userNotifications.unreadCount = 0;
    await effects.gql.mutations.markAllNotificationsAsRead({});
    await effects.gql.mutations.clearNotificationCount({});
  } catch {
    state.userNotifications.notifications = oldNotifications;
    state.userNotifications.unreadCount = count;
    effects.notificationToast.error(
      'There has been a problem removing them from your team'
    );
  }
};

export const getNotifications: AsyncAction = async ({ state, effects }) => {
  try {
    const { me } = await effects.gql.queries.getRecentNotifications({});

    state.userNotifications.notifications = me.notifications;
  } catch {
    effects.notificationToast.error(
      'There has been a problem removing them from your team'
    );
  }
};

export const openTeamAcceptModal: Action<{
  teamName: string;
  teamId: string;
  userAvatar: string;
}> = ({ state }, activeInvitation) => {
  state.userNotifications.activeInvitation = activeInvitation;
  state.currentModal = 'teamInvite';
};
