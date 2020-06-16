import { gql, Query } from 'overmind-graphql';

export const markAllNotificationsAsRead: Query<
  { markAllNotificationsAsRead: { id: string } },
  {}
> = gql`
  mutation MarkNotificationsAsRead {
    markAllNotificationsAsRead {
      id
    }
  }
`;

export const clearNotificationCount: Query<
  { clearNotificationCount: { id: string } },
  {}
> = gql`
  mutation ClearNotificationCount {
    clearNotificationCount {
      id
    }
  }
`;
