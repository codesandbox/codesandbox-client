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
  (_, { sandboxId }) => sandboxId,
  directoriesSelector,
  entriesInDirectorySelector,
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
