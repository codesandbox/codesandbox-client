type State = {
  connected: boolean;
  unreadCount: number;
  notificationsOpened: boolean;
};

export const state: State = {
  connected: false,
  unreadCount: 0,
  notificationsOpened: false,
};
