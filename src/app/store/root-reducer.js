import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux';

import entityReducer from './entities/reducer';
import contextMenuReducer from './context-menu/reducer';
import notificationsReducer from './notifications/reducer';
import preferencesReducer from './preferences/reducer';
import userReducer from './user/reducer';

export default combineReducers({
  entities: entityReducer,
  contextMenu: contextMenuReducer,
  notifications: notificationsReducer,
  preferences: preferencesReducer,
  router: routerReducer,
  user: userReducer,
});
