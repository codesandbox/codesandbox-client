import { createSelector } from 'reselect';

export const sandboxesSelector = state => state.entities.sandboxes;

export const singleSandboxSelector = createSelector(
  sandboxesSelector,
  (_, { id }) => id,
  (sandboxes, id) => sandboxes[id]
);

const PRIVACY_NAMES = ['Public', 'Unlisted', 'Private'];

export const privacyNameSelector = privacy => PRIVACY_NAMES[+privacy];
