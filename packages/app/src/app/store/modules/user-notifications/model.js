import { types } from 'mobx-state-tree';

export default {
  notifications: types.array(
    types.model({
      type: types.string,
      unread: types.boolean,
    })
  ),
  connected: types.boolean,
};
