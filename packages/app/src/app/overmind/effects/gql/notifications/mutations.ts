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
    $emailMarketing: Boolean
    $emailNewComment: Boolean
    $emailSandboxInvite: Boolean
    $emailTeamInvite: Boolean
    $inAppPrReviewReceived: Boolean
    $inAppPrReviewRequest: Boolean
  ) {
    updateNotificationPreferences(
      emailCommentMention: $emailCommentMention
      emailCommentReply: $emailCommentReply
      emailMarketing: $emailMarketing
      emailNewComment: $emailNewComment
      emailSandboxInvite: $emailSandboxInvite
      emailTeamInvite: $emailTeamInvite
      inAppPrReviewReceived: $inAppPrReviewReceived
      inAppPrReviewRequest: $inAppPrReviewRequest
    ) {
      emailCommentMention
      emailCommentReply
      emailMarketing
      emailNewComment
      emailSandboxInvite
      emailTeamInvite
      inAppPrReviewReceived
      inAppPrReviewRequest
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
