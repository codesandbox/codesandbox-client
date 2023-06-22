import { RecentNotificationFragment } from 'app/graphql/types';

export type preferenceTypes = {
  emailCommentMention: boolean;
  emailCommentReply: boolean;
  emailMarketing: boolean;
  emailNewComment: boolean;
  emailSandboxInvite: boolean;
  emailTeamInvite: boolean;
  inAppPrReviewReceived: boolean;
  inAppPrReviewRequest: boolean;
};

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
  preferences: preferenceTypes | null;
};

export const state: State = {
  notifications: null,
  connected: false,
  unreadCount: 0,
  notificationsOpened: false,
  activeInvitation: null,
  activeFilters: [],
  preferences: null,
};
