import { createSelector } from 'reselect';

export const sandboxesSelector = state => state.entities.sandboxes;

export const singleSandboxSelector = createSelector(
  sandboxesSelector,
  (_, { id }) => id,
  (sandboxes, id) => sandboxes[id],
);
