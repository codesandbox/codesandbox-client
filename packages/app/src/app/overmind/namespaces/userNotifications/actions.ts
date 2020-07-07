import { client } from 'app/graphql/client';
import { Action, AsyncAction } from 'app/overmind';

import gql from 'graphql-tag';

import * as internalActions from './internalActions';
import { preferenceTypes } from './state';

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

export const notificationsOpened: AsyncAction = async ({ state, effects }) => {
  state.userNotifications.notificationsOpened = true;
  await effects.gql.mutations.clearNotificationCount({});
  state.userNotifications.unreadCount = 0;
};

export const filterNotifications: AsyncAction<string> = async (
  { state, effects },
  filter
) => {
  const filters = state.userNotifications.activeFilters;
  if (filters.includes(filter)) {
    state.userNotifications.activeFilters = filters.filter(f => f !== filter);
  } else {
    state.userNotifications.activeFilters = filters.concat(filter);
  }
  try {
    const { me } = await effects.gql.queries.getRecentNotifications({
      type: state.userNotifications.activeFilters,
    });

    state.userNotifications.notifications =
      me && me.notifications ? me.notifications : null;
  } catch {
    state.userNotifications.activeFilters = filters;
  }
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
      'There has been a problem marking your notifications as read'
    );
  }
};

export const archiveNotification: AsyncAction<string> = async (
  { state, effects },
  id
) => {
  if (!state.userNotifications.notifications) return;
  const oldNots = state.userNotifications.notifications;
  try {
    state.userNotifications.notifications = state.userNotifications.notifications.filter(
      not => not.id !== id
    );
    await effects.gql.mutations.archiveNotification({
      notificationId: id,
    });
  } catch {
    state.userNotifications.notifications = oldNots;
  }
};

export const archiveAllNotifications: AsyncAction = async ({
  state,
  effects,
}) => {
  if (!state.userNotifications.notifications) return;
  const oldNots = state.userNotifications.notifications;
  try {
    state.userNotifications.notifications = [];
    await effects.gql.mutations.archiveAllNotifications({});
  } catch {
    state.userNotifications.notifications = oldNots;
  }
};

export const updateReadStatus: AsyncAction<string> = async (
  { state, effects },
  id
) => {
  if (!state.userNotifications.notifications) return;
  const oldNots = state.userNotifications.notifications;
  const currentValue = (
    state.userNotifications.notifications.find(not => not.id === id) || {}
  ).read;
  try {
    state.userNotifications.notifications = state.userNotifications.notifications.map(
      not => {
        if (not.id === id) {
          return {
            ...not,
            read: !currentValue,
          };
        }

        return not;
      }
    );
    await effects.gql.mutations.updateNotificationReadStatus({
      notificationId: id,
      read: !currentValue,
    });
  } catch {
    state.userNotifications.notifications = oldNots;
  }
};

export const getNotifications: AsyncAction = async ({ state, effects }) => {
  try {
    const { me } = await effects.gql.queries.getRecentNotifications({
      type: [],
    });

    state.userNotifications.notifications =
      me && me.notifications ? me.notifications : null;
  } catch {
    effects.notificationToast.error(
      'There has been a problem getting your notifications'
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

export const getNotificationPreferences: AsyncAction = async ({
  state,
  effects,
}) => {
  if (!state.user) return;
  try {
    const data = await effects.gql.queries.getEmailPreferences({});

    if (!data.me || !data.me.notificationPreferences) return;

    state.userNotifications.preferences = data.me.notificationPreferences;
  } catch {
    effects.notificationToast.error(
      'There has been a problem getting your email preferences'
    );
  }
};

type PreferenceTypes = {
  [key in keyof preferenceTypes]: boolean;
};

export const updateNotificationPreferences: AsyncAction<Partial<
  PreferenceTypes
>> = async ({ state, effects }, preference) => {
  if (!state.user) return;
  const oldPreferences = state.userNotifications.preferences;
  const newPreferences = {
    ...oldPreferences,
    ...preference,
  } as PreferenceTypes;
  try {
    state.userNotifications.preferences = newPreferences;
    await effects.gql.mutations.updateNotificationPreferences(newPreferences);
  } catch {
    state.userNotifications.preferences = oldPreferences;
    effects.notificationToast.error(
      'There has updating your email preferences'
    );
  }
};
