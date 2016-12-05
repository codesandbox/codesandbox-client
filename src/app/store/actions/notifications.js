// @flow
import type { NotificationButton } from '../reducers/notifications';

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';

let lastId = 0;

export default {
  addNotification: (
    title: string,
    body: string,
    notificationType: 'notice' | 'warning' | 'error' = 'notice',
    buttons: Array<NotificationButton> = [],
    timeAlive: number = 5,
  ) => ({
    id: (lastId += 1),
    type: ADD_NOTIFICATION,
    title,
    body,
    notificationType,
    buttons,
    endTime: Date.now() + (timeAlive * 1000),
  }),
  removeNotification: (id: number) => ({ type: REMOVE_NOTIFICATION, id }),
};
