import {
  RecentNotificationsQuery,
  RecentNotificationsQueryVariables,
  EmailPreferencesQuery,
  EmailPreferencesQueryVariables,
} from 'app/graphql/types';
import { Query, gql } from 'overmind-graphql';

import { recentNotificationFragment } from './fragments';

export const getEmailPreferences: Query<
  EmailPreferencesQuery,
  EmailPreferencesQueryVariables
> = gql`
  query EmailPreferences {
    me {
      notificationPreferences {
        emailCommentMention
        emailCommentReply
        emailMarketing
        emailNewComment
        emailSandboxInvite
        emailTeamInvite
        inAppPrReviewRequest
        inAppPrReviewReceived
      }
    }
  }
`;

export const getRecentNotifications: Query<
  RecentNotificationsQuery,
  RecentNotificationsQueryVariables
> = gql`
  query RecentNotifications($type: [String]) {
    me {
      notifications(
        limit: 20
        type: $type
        orderBy: { field: "insertedAt", direction: ASC }
      ) {
        ...RecentNotification
      }
    }
  }
  ${recentNotificationFragment}
`;
