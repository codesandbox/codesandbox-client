import {
  notificationState,
  convertTypeToStatus,
} from '@codesandbox/common/lib/utils/notifications';
import {
  NotificationMessage,
  NotificationStatus,
} from '@codesandbox/notifications/lib/state';

export default {
  convertTypeToStatus,
  add(notification: NotificationMessage) {
    notificationState.addNotification(notification);
  },
  error(message: string) {
    notificationState.addNotification({
      message,
      status: NotificationStatus.ERROR,
    });
  },
  success(message: string) {
    notificationState.addNotification({
      message,
      status: NotificationStatus.SUCCESS,
    });
  },
  warning(message: string) {
    notificationState.addNotification({
      message,
      status: NotificationStatus.WARNING,
    });
  },
  notice(message: string) {
    notificationState.addNotification({
      message,
      status: NotificationStatus.NOTICE,
    });
  },
};
