// @flow
import type { NotificationButton } from './reducer';

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';

let lastId = 0;

export default {
  addNotification: (
    title: string,
    notificationType: 'notice' | 'warning' | 'error' | 'success' = 'notice',
    timeAlive: number = 2,
    buttons: Array<NotificationButton> = []
  ) => {
    lastId += 1;
    return {
      id: lastId,
      type: ADD_NOTIFICATION,
      title,
      notificationType,
      buttons,
      endTime: Date.now() + timeAlive * 1000,
    };
  },
  removeNotification: (id: number) => ({ type: REMOVE_NOTIFICATION, id }),
};
