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

export const markNotificationAsRead: Query<
  { markAllNotificationsAsRead: { id: string } },
  { notificationId: string }
> = gql`
  mutation MarkNotificationsAsRead($notificationId: String) {
    markNotificationAsRead(notificationId: $notificationId) {
      id
    }
  }
`;

export const archiveNotification: Query<
  { archiveNotification: { id: string } },
  { notificationId: string }
> = gql`
  mutation ArchiveNotification($notificationId: String) {
    archiveNotification(notificationId: $notificationId) {
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
