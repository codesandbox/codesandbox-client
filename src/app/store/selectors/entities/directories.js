import { createSelector } from 'reselect';
import { values } from 'lodash';
import { singleSandboxSelector } from '../sandboxes/selector';
import { entriesInDirectorySelector } from '../../selectors/entry-selectors';

export const directoriesSelector = state => state.entities.directories;

export const singleDirectoryByIdSelector = createSelector(
  directoriesSelector,
  (_, { id }) => id,
  (dirs, id) => dirs[id],
);

export const directoriesInDirectorySelector = createSelector(
  (_, { id }) => id,
  (_, { sourceId }) => sourceId,
  directoriesSelector,
  entriesInDirectorySelector,
);

export const directoriesBySandboxSelector = createSelector(
  singleSandboxSelector,
  directoriesSelector,
  (sandbox, directories) => {
    if (sandbox == null) return [];

    return values(directories).filter(d => d.sourceId === sandbox.source);
  },
);

export const rootDirectoriesSelector = createSelector(
  directoriesBySandboxSelector,
  directories => getDirectoriesInDirectory(null, directories),
);
