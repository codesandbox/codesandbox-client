import { Action } from 'app/overmind';

export const initialize: Action = async ({ state, effects, actions }) => {
  const { unread } = await effects.notifications.joinChannel(state.user.id);

  state.userNotifications.connected = true;
  state.userNotifications.unreadCount = unread;

  effects.notifications.listen(
    actions.userNotifications.internal.messageReceived
  );
};

export const messageReceived: Action<{ event: string; data: any }> = (
  { state },
  message
) => {
  switch (message.event) {
    case 'new-notification': {
      if (!state.userNotifications.notificationsOpened) {
        state.userNotifications.unreadCount++;
      }
    }
  }
};
