import { combineReducers } from 'redux';

import entityReducer from './entities/reducer';
import contextMenuReducer from './context-menu/reducer';
import notificationsReducer from './notifications/reducer';

export default combineReducers({
  entities: entityReducer,
  contextMenu: contextMenuReducer,
  notifications: notificationsReducer,
});
