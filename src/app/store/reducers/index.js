// @flow
import { combineReducers } from 'redux';
import entities from './entities';
import user from './user';

export default combineReducers({
  entities,
  user,
});
