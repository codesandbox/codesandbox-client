import { createSelector } from 'reselect';
import { values, sortBy } from 'lodash';
import { singleSandboxSelector } from '../sandboxes/selector';

export const directoriesSelector = state => state.entities.directories;

export const singleDirectoryByIdSelector = createSelector(
  directoriesSelector,
  (_, { id }) => id,
  (dirs, id) => dirs[id],
);

export const getDirectoriesInDirectory = (directoryId, directories) => (
  sortBy(
    values(directories).filter(m => m.directoryId === directoryId), m => m.title.toUpperCase(),
  )
);

export const directoriesInDirectorySelector = createSelector(
  (_, { id }) => id,
  directoriesSelector,
  getDirectoriesInDirectory,
);

export const directoriesBySandboxSelector = createSelector(
  singleSandboxSelector,
  directoriesSelector,
  (sandbox, directories) => {
    if (sandbox == null) return [];

    return values(directories).filter(d => d.sandboxId === sandbox.id);
  },
);

export const rootDirectoriesSelector = createSelector(
  directoriesBySandboxSelector,
  directories => getDirectoriesInDirectory(null, directories),
);
