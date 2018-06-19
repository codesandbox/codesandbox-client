import { types } from 'mobx-state-tree';

export default {
  unreadCount: types.number,
  connected: types.boolean,
  notificationsOpened: types.boolean,
};
