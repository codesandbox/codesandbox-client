import { createSelector } from 'reselect';

export const directoriesSelector = state => state.entities.directories;

export const directoriesFromSandboxSelector = createSelector(
  directoriesSelector,
  (_, props) => props.sandbox.directories,
  (directories, ids) => ids.map(id => directories[id]),
);
