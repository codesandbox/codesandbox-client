import {
  NotificationState,
  NotificationStatus,
} from '@codesandbox/notifications';

export const notificationState = new NotificationState();

export type NotificationType = 'notice' | 'success' | 'warning' | 'error';

export function convertTypeToStatus(
  type: NotificationType
): NotificationStatus {
  switch (type) {
    case 'notice':
      return NotificationStatus.NOTICE;
    case 'warning':
      return NotificationStatus.WARNING;
    case 'error':
      return NotificationStatus.ERROR;
    case 'success':
      return NotificationStatus.SUCCESS;
    default:
      return NotificationStatus.NOTICE;
  }
}
