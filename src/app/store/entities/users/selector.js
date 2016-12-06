import { createSelector } from 'reselect';
import { values } from 'lodash';

const idSelector = (state, { userId }) => userId;
const usernameSelector = (state, { username }) => username;

export const usersSelector = state => state.entities.users;
export const singleUserSelector = createSelector(
  usersSelector,
  idSelector,
  (users, id) => users[id],
);

export const singleUserByUsernameSelector = createSelector(
  usersSelector,
  usernameSelector,
  (users, username) => values(users).find(u => u.username === username),
);
