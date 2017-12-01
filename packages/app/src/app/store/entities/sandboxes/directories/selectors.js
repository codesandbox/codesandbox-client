import { createSelector } from 'reselect';
import { values } from 'lodash';

export const directoriesSelector = state => state.entities.directories;

export const directoriesFromSandboxSelector = createSelector(
  directoriesSelector,
  (_, props) => props.directories || props.sandbox.directories,
  (directories, ids) => ids.map(id => directories[id])
);

export const singleDirectorySelector = createSelector(
  directoriesSelector,
  (_, { sourceId, shortid, id }) => ({ id, sourceId, shortid }),
  (directories, { sourceId, id, shortid }) =>
    values(directories).find(
      d => d.id === id || (d.sourceId === sourceId && d.shortid === shortid)
    )
);
