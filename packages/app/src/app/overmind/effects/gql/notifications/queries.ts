import {
  RecentNotificationsQuery,
  RecentNotificationsQueryVariables,
} from 'app/graphql/types';
import { Query, gql } from 'overmind-graphql';

import { recentNotificationFragment } from './fragments';

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
