import { sortBy, values } from 'lodash';
import { createSelector } from 'reselect';

export const allVersionsSelector = state => state.entities.versions;

export const versionsBySandboxSelector = createSelector(
  (_, props) => props.sandboxId,
  allVersionsSelector,
  (sandboxId, versions) => (
    sortBy(
      values(versions).filter(v => v.sandbox === sandboxId),
      v => v.version,
    ).reverse()
  ),
);
