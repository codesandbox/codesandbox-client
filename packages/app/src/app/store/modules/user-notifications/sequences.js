import { set, equals, when } from 'cerebral/operators';
import { state, props } from 'cerebral/tags';
import * as actions from './actions';

export const initializeNotifications = [
  actions.connectToChannel,
  set(props`listenSignalPath`, 'userNotifications.messageReceived'),
  actions.listen,
];

export const openNotifications = [
  set(state`userNotifications.notificationsOpened`, true),
  set(state`userNotifications.unreadCount`, 0),
  actions.sendNotificationsRead,
];

export const closeNotifications = [
  set(state`userNotifications.notificationsOpened`, false),
];

export const handleMessage = [
  equals(props`event`),
  {
    'new-notification': [
      when(state`userNotifications.notificationsOpened`),
      {
        true: [],
        false: [actions.addUnreadCount],
      },
    ],
    otherwise: [],
  },
];
