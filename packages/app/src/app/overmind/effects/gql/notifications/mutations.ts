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

export const archiveAllNotifications: Query<
  { archiveAllNotifications: { id: string } },
  {}
> = gql`
  mutation ArchiveAllNotifications {
    archiveAllNotifications {
      id
    }
  }
`;

export const updateNotificationReadStatus: Query<
  { markAllNotificationsAsRead: { id: string } },
  { notificationId: string; read: boolean }
> = gql`
  mutation UpdateNotificationReadStatus(
    $notificationId: String
    $read: Boolean
  ) {
    updateNotificationReadStatus(notificationId: $notificationId, read: $read) {
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
