import { RecentNotificationFragment } from 'app/graphql/types';

type State = {
  notifications: RecentNotificationFragment[] | null;
  connected: boolean;
  unreadCount: number;
  notificationsOpened: boolean;
  activeInvitation: {
    teamName: string;
    teamId: string;
    userAvatar: string;
  } | null;
  activeFilters: string[];
};

export const state: State = {
  notifications: null,
  connected: false,
  unreadCount: 0,
  notificationsOpened: false,
  activeInvitation: null,
  activeFilters: [],
};
