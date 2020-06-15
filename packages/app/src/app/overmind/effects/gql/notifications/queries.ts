import { gql, Query } from 'overmind-graphql';
import { Notification } from 'app/graphql/types';

type lol = { me: { notifications: Notification[] } };

export const getRecentNotifications: Query<lol, {}> = gql`
  query RecentNotifications {
    me {
      notifications(
        limit: 20
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
