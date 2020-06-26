import {
  ArchiveAllNotificationsMutation,
  ArchiveAllNotificationsMutationVariables,
  ArchiveNotificationMutation,
  ArchiveNotificationMutationVariables,
  ClearNotificationCountMutation,
  ClearNotificationCountMutationVariables,
  MarkNotificationsAsReadMutation,
  MarkNotificationsAsReadMutationVariables,
  UpdateNotificationReadStatusMutation,
  UpdateNotificationReadStatusMutationVariables,
} from 'app/graphql/types';
import { Query, gql } from 'overmind-graphql';

export const markAllNotificationsAsRead: Query<
  MarkNotificationsAsReadMutation,
  MarkNotificationsAsReadMutationVariables
> = gql`
  mutation MarkNotificationsAsRead {
    markAllNotificationsAsRead {
      id
    }
  }
`;

export const archiveAllNotifications: Query<
  ArchiveAllNotificationsMutation,
  ArchiveAllNotificationsMutationVariables
> = gql`
  mutation ArchiveAllNotifications {
    archiveAllNotifications {
      id
    }
  }
`;

export const updateNotificationReadStatus: Query<
  UpdateNotificationReadStatusMutation,
  UpdateNotificationReadStatusMutationVariables
> = gql`
  mutation UpdateNotificationReadStatus($notificationId: ID!, $read: Boolean!) {
    updateNotificationReadStatus(notificationId: $notificationId, read: $read) {
      id
    }
  }
`;

export const archiveNotification: Query<
  ArchiveNotificationMutation,
  ArchiveNotificationMutationVariables
> = gql`
  mutation ArchiveNotification($notificationId: ID!) {
    archiveNotification(notificationId: $notificationId) {
      id
    }
  }
`;

export const clearNotificationCount: Query<
  ClearNotificationCountMutation,
  ClearNotificationCountMutationVariables
> = gql`
  mutation ClearNotificationCount {
    clearNotificationCount {
      id
    }
  }
`;
