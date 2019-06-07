import {
  notificationState,
  convertTypeToStatus,
} from '@codesandbox/common/lib/utils/notifications';
import { NotificationMessage } from '@codesandbox/notifications/lib/state';

export default {
  convertTypeToStatus,
  add(notification: NotificationMessage) {
    notificationState.addNotification(notification);
  },
};
