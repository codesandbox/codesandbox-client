import { Notification } from 'app/graphql/types';

type State = {
  notifications: Notification[] | null;
  connected: boolean;
  unreadCount: number;
  notificationsOpened: boolean;
};

export const state: State = {
  notifications: null,
  connected: false,
  unreadCount: 0,
  notificationsOpened: false,
};
