// @flow
import { combineReducers } from 'redux';
import entities from './entities';
import modal from './modal';
import user from './user';

export default combineReducers({
  entities,
  modal,
  user,
});
