import { createSelector } from 'reselect';
import { values, sortBy } from 'lodash';

import { singleSandboxSelector } from '../sandboxes/selector';
import resolveModule from '../../../../sandbox/utils/resolve-module';
import { directoriesBySandboxSelector } from '../directories/selector';

export const modulesSelector = state => state.entities.modules;
export const defaultModuleSelector = state => modulesSelector(state).default;
export const singleModuleSelector = (state, { id }) => (
  modulesSelector(state)[id] || defaultModuleSelector(state)
);

export const getModulesInDirectory = (directoryId, modules) => (
  sortBy(values(modules).filter(m => m.directoryId === directoryId), m => m.title.toUpperCase())
);

export const modulesBySandboxSelector = createSelector(
  singleSandboxSelector,
  modulesSelector,
  (sandbox, modules) => {
    if (sandbox == null) return [];

    return values(modules).filter(m => m.sandboxId === sandbox.id);
  },
);

export const moduleByPathSelector = createSelector(
  modulesBySandboxSelector,
  directoriesBySandboxSelector,
  (_, { modulePath }) => modulePath,
  (modules, directories, modulePath) => {
    try {
      return resolveModule(modulePath, modules, directories);
    } catch (e) {
      return modules[0];
    }
  },
);

export const rootModulesSelector = createSelector(
  modulesBySandboxSelector,
  modules => getModulesInDirectory(null, modules),
);

export const modulesInDirectorySelector = createSelector(
  (_, { id }) => id,
  modulesSelector,
  getModulesInDirectory,
);

