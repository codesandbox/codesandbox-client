import { client } from 'app/graphql/client';
import { CLEAR_NOTIFICATION_MUTATION } from './queries';

export function connectToChannel({ notifications, state }) {
  notifications.joinChannel().then(({ unread }) => {
    state.set('userNotifications.connected', true);
    state.set('userNotifications.unreadCount', unread);
  });
}

export function addUnreadCount({ state }) {
  state.set(
    'userNotifications.unreadCount',
    state.get('userNotifications.unreadCount') + 1
  );
}

export function listen({ props, notifications }) {
  notifications.listen(props.listenSignalPath);
}

export function sendNotificationsRead() {
  client.mutate({
    mutation: CLEAR_NOTIFICATION_MUTATION,
  });
}
