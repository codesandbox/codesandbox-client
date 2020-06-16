import { gql, Query } from 'overmind-graphql';
import { Notification } from 'app/graphql/types';

type response = { me: { notifications: Notification[] } };

export const getRecentNotifications: Query<response, { type: string[] }> = gql`
  query RecentNotifications($type: [String]) {
    me {
      notifications(
        limit: 20
        type: $type
        orderBy: { field: "insertedAt", direction: ASC }
      ) {
        id
        type
        data
        read
      }
    }
  }
`;
