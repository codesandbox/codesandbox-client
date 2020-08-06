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
  UpdateNotificationPreferencesMutation,
  UpdateNotificationPreferencesMutationVariables,
} from 'app/graphql/types';
import { Query, gql } from 'overmind-graphql';

export const updateNotificationPreferences: Query<
  UpdateNotificationPreferencesMutation,
  UpdateNotificationPreferencesMutationVariables
> = gql`
  mutation UpdateNotificationPreferences(
    $emailCommentMention: Boolean
    $emailCommentReply: Boolean
    $emailNewComment: Boolean
  ) {
    updateNotificationPreferences(
      emailCommentMention: $emailCommentMention
      emailCommentReply: $emailCommentReply
      emailNewComment: $emailNewComment
    ) {
      emailCommentMention
      emailCommentReply
      emailNewComment
    }
  }
`;

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
  mutation UpdateNotificationReadStatus(
    $notificationId: UUID4!
    $read: Boolean!
  ) {
    updateNotificationReadStatus(notificationId: $notificationId, read: $read) {
      id
    }
  }
`;

export const archiveNotification: Query<
  ArchiveNotificationMutation,
  ArchiveNotificationMutationVariables
> = gql`
  mutation ArchiveNotification($notificationId: UUID4!) {
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
