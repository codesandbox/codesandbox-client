export function connectToChannel({ notifications, state }) {
  notifications.joinChannel().then(({ notifications: notifs, unread }) => {
    state.set('userNotifications.notifications', notifs);
    state.set('userNotifications.connected', true);
    state.set('userNotifications.unreadCount', unread);
  });
}
