import { values } from 'lodash';

export const sandboxesSelector = state => state.entities.sandboxes;
export const singleSandboxSelector = (state, { id }) => sandboxesSelector(state)[id];
export const singleSandboxBySlugSelector = (state, { slug }) => {
  const sandboxes = sandboxesSelector(state);
  return values(sandboxes).find(s => s.slug === slug);
};
