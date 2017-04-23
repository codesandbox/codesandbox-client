import { createSelector } from 'reselect';

export const modulesSelector = state => state.entities.modules;
export const isMainModule = module =>
  module.title === 'index.js' && module.directoryShortid == null;

function findById(entities, id) {
  return entities.find(e => e.id === id);
}

export const getModulePath = (modules, directories, id) => {
  const module = findById(modules, id);

  if (!module) return '';

  let directory = findById(directories, module.directoryShortid);
  let path = '/';
  while (directory != null) {
    path = `/${directory.title}${path}`;
    directory = findById(directories, directory.directoryShortid);
  }
  return path;
};

export const modulesFromSandboxSelector = createSelector(
  modulesSelector,
  (_, props) => props.sandbox.modules,
  (modules, ids) => ids.map(id => modules[id]),
);

export const modulesFromSandboxNotSavedSelector = createSelector(
  modulesFromSandboxSelector,
  modules => modules.some(m => m.isNotSynced),
);
