// @flow
import { combineReducers } from 'redux';

import contextMenu from './context-menu';
import entities from './entities';
import modal from './modal';
import notifications from './notifications';
import user from './user';
import views from './views';

export default combineReducers({
  contextMenu,
  entities,
  modal,
  notifications,
  user,
  views,
});
