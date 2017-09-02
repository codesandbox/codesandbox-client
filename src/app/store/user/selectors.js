import { createSelector } from 'reselect';

export const currentUserSelector = state => state.user;
export const jwtSelector = state => state.user.jwt;
export const userIdSelector = state => state.user.id;
export const loggedInSelector = state => !!jwtSelector(state);
export const isPatronSelector = createSelector(
  currentUserSelector,
  user => user.subscription && user.subscription.since
);
export const badgesSelector = createSelector(
  currentUserSelector,
  user => user.badges
);
