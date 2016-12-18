import { createSelector } from 'reselect';
import { values } from 'lodash';

import { singleUserByUsernameSelector } from '../users/selector';

export const sandboxesSelector = state => state.entities.sandboxes;
export const singleSandboxSelector = createSelector(
  sandboxesSelector,
  (state, props) => props,
  singleUserByUsernameSelector,
  (sandboxes, props, user) => {
    const { id, slug } = props;
    if (id) return sandboxes[id];
    const username = user ? user.username : null;
    return values(sandboxes).find(s => s.slug === slug && s.author === username);
  },
);
export const singleSandboxBySlugSelector = (state, { slug }) => {
  const sandboxes = sandboxesSelector(state);
  return values(sandboxes).find(s => s.slug === slug);
};
