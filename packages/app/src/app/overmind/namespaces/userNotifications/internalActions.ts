import { Context } from 'app/overmind';

export const initialize = async ({ state, effects, actions }: Context) => {
  if (!state.user || !state.user.id) {
    return;
  }

  const { unread } = await effects.notifications.joinChannel(state.user.id);

  state.userNotifications.connected = true;
  state.userNotifications.unreadCount = unread;

  effects.notifications.listen(
    actions.userNotifications.internal.messageReceived
  );
};

export const messageReceived = (
  { state }: Context,
  message: { event: string; data: any }
) => {
  switch (message.event) {
    case 'new-notification': {
      if (!state.userNotifications.notificationsOpened) {
        state.userNotifications.unreadCount++;
      }
    }
  }
};
