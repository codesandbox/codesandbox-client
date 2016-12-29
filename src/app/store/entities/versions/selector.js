import { sortBy } from 'lodash';
import { createSelector } from 'reselect';

export const allVersionsSelector = state => state.entities.versions;

export const versionsBySandboxSelector = createSelector(
  (_, props) => props.sandbox.versions,
  allVersionsSelector,
  (versionIds, versions) => (
    sortBy(
      versionIds.map(v => versions[v]),
      v => v.version,
    ).reverse()
  ),
);
