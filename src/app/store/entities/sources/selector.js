import { createSelector } from 'reselect';

export const sourcesSelector = state => state.entities.sources;
export const singleSourceSelector = createSelector(
  sourcesSelector,
  (state, { id }) => id,
  (sources, id) => sources[id],
);
