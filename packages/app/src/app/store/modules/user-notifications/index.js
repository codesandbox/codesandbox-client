import { Module } from 'cerebral';
import model from './model';

import * as sequences from './sequences';

export default Module({
  model,
  state: {
    connected: false,
    unreadCount: 0,
    notificationsOpened: false,
  },
  signals: {
    notificationsOpened: sequences.openNotifications,
    notificationsClosed: sequences.closeNotifications,
    messageReceived: sequences.handleMessage,
  },
});
