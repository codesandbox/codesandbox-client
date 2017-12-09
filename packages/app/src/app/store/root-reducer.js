import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux';

import entityReducer from './entities/reducer';
import contextMenuReducer from './context-menu/reducer';
import modalReducer from './modal/reducer';
import notificationsReducer from './notifications/reducer';
import preferencesReducer from './preferences/reducer';
import userReducer from './user/reducer';
import connectionStatusReducer from './connection/reducer';
import viewReducer from './view/reducer';

export default combineReducers({
  entities: entityReducer,
  contextMenu: contextMenuReducer,
  connectionStatus: connectionStatusReducer,
  modal: modalReducer,
  notifications: notificationsReducer,
  preferences: preferencesReducer,
  router: routerReducer,
  user: userReducer,
  view: viewReducer,
});
