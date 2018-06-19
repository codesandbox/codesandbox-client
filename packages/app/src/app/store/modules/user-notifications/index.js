import { Module } from 'cerebral';
import model from './model';

import * as sequences from './sequences';

export default Module({
  model,
  state: {
    notifications: [],
    connected: false,
    unreadCount: 0,
  },
  signals: {},
});
