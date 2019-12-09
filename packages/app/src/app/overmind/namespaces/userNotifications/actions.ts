import { AsyncAction, Action } from 'app/overmind';
import { client } from 'app/graphql/client';
import gql from 'graphql-tag';
import * as internalActions from './internalActions';

export const internal = internalActions;

export const notificationsOpened: AsyncAction = async ({ state }) => {
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
};

export const notificationsClosed: Action = ({ state }) => {
  state.userNotifications.notificationsOpened = false;
};

export const messageReceived: Action<{ event: string }> = (
  { state },
  { event }
) => {
  if (event === 'new-notification') {
    state.userNotifications.unreadCount++;
  }
};
