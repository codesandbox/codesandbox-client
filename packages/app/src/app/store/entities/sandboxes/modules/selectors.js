// @flow
import type { Directory, Module } from 'common/types';
import { createSelector } from 'reselect';
import { values } from 'lodash';
import resolveModule from 'common/sandbox/resolve-module';

export const modulesSelector = state => state.entities.modules;

function findById(entities: Array<Module | Directory>, id: string) {
  return entities.find(e => e.id === id);
}

function findByShortid(entities: Array<Module | Directory>, shortid: ?string) {
  return entities.find(e => e.shortid === shortid);
}

export const getModulePath = (
  modules: Array<Module>,
  directories: Array<Directory>,
  id: string
) => {
  const module = findById(modules, id);

  if (!module) return '';

  let directory = findByShortid(directories, module.directoryShortid);
  let path = '/';
  while (directory != null) {
    path = `/${directory.title}${path}`;
    directory = findByShortid(directories, directory.directoryShortid);
  }
  return `${path}${module.title}`;
};

export const isMainModule = (
  module: Module,
  modules: Module[],
  directories: Directory[],
  entry: string = 'index.js'
) => {
  const path = getModulePath(modules, directories, module.id);

  return path.replace('/', '') === entry;
};

export const findMainModule = (
  modules: Module[],
  directories: Directory[],
  entry: string = 'index.js'
) => {
  try {
    const module = resolveModule(entry, modules, directories);

    return module;
  } catch (e) {
    return modules[0];
  }
};

export const findCurrentModule = (
  modules: Module[],
  directories: Directory[],
  modulePath: ?string = '',
  mainModule: Module
): Module => {
  // cleanPath, encode and replace first /
  const cleanPath = decodeURIComponent(modulePath).replace('/', '');
  let foundModule = null;
  try {
    foundModule = resolveModule(cleanPath, modules, directories);
  } catch (e) {
    /* leave empty */
  }

  return (
    foundModule ||
    modules.find(m => m.id === modulePath) ||
    modules.find(m => m.shortid === modulePath) || // deep-links requires this
    mainModule
  );
};
/**
 * Return an array of the ids of the directories that are the parents of the given module
 */
export const getModuleParents = (
  modules: Array<Module>,
  directories: Array<Directory>,
  id: string
) => {
  const module = findById(modules, id);

  if (!module) return [];

  let directory = findByShortid(directories, module.directoryShortid);
  let directoryIds = [];
  while (directory != null) {
    directoryIds = [...directoryIds, directory.id];
    directory = findByShortid(directories, directory.directoryShortid);
  }

  return directoryIds;
};

export const modulesFromSandboxSelector = createSelector(
  modulesSelector,
  (_, props) => props.modules || props.sandbox.modules,
  (modules, ids) => ids.map(id => modules[id])
);

export const modulesFromSandboxNotSavedSelector = createSelector(
  modulesFromSandboxSelector,
  modules => modules.some(m => m.isNotSynced)
);

export const singleModuleSelector = createSelector(
  modulesSelector,
  (_, { sourceId, shortid, id }) => ({ id, sourceId, shortid }),
  (modules, { sourceId, id, shortid }) =>
    values(modules).find(
      m => m.id === id || (m.sourceId === sourceId && m.shortid === shortid)
    )
);

export const moduleErrorsFromSandboxSelector = createSelector(
  modulesFromSandboxSelector,
  modules =>
    modules.reduce(
      (total, module) => (module.errors ? [...total, ...module.errors] : total),
      []
    )
);
