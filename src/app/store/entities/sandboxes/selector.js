import { createSelector } from 'reselect';
import { values } from 'lodash';

import { singleUserByUsernameSelector } from '../users/selector';

export const sandboxesSelector = state => state.entities.sandboxes;
export const singleSandboxSelector = createSelector(
  sandboxesSelector,
  (state, props) => props,
  singleUserByUsernameSelector,
  (sandboxes, props, user) => {
    const { slug, username, id } = props;
    if (slug && username && username !== 'sandbox') {
      return values(sandboxes).find(s => s.slug === slug && s.author === user.id);
    }

    return sandboxes[id];
  },
);
export const singleSandboxBySlugSelector = (state, { slug }) => {
  const sandboxes = sandboxesSelector(state);
  return values(sandboxes).find(s => s.slug === slug);
};
