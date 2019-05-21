import { NotificationStatus } from '@codesandbox/notifications';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';

export default {
  add(notification: { message: string; status: NotificationStatus }) {
    notificationState.addNotification(notification);
  },
};
