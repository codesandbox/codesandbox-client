import { createSelector } from 'reselect';
import { values } from 'lodash';

import { singleSandboxSelector } from '../sandboxes/selector';
import resolveModule from '../../../../sandbox/utils/resolve-module';
import { directoriesBySandboxSelector, directoriesSelector } from '../directories/selector';
import { entriesInDirectorySelector } from '../../selectors/entry-selectors';
import { currentTabSelector } from '../../selectors/views/sandbox-selector';
import { isMainModule } from './index';

export const modulesSelector = state => state.entities.modules;
export const singleModuleSelector = (state, { id }) => (
  modulesSelector(state)[id]
);

export const modulesBySandboxSelector = createSelector(
  singleSandboxSelector,
  modulesSelector,
  (sandbox, modules) => {
    if (sandbox == null) return [];

    return values(modules).filter(m => m.sourceId === sandbox.source);
  },
);

export const defaultModuleSelector = (state, { sandboxId }) => (
  modulesBySandboxSelector(state, { id: sandboxId }).filter(isMainModule)[0]
);

export const currentModuleSelector = createSelector(
  currentTabSelector,
  modulesSelector,
  (tab, modules) => {
    if (tab == null || tab.moduleId == null) return null;

    return modules[tab.moduleId];
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
      console.error(e);
      return modules[0];
    }
  },
);

export const modulePathSelector = createSelector(
  modulesSelector,
  directoriesSelector,
  (_, { id }) => id,
  (modules, directories, id) => {
    const module = modules[id];

    if (!module) return '';

    let directory = directories[module.directoryId];
    let path = '/';
    while (directory != null) {
      path = `/${directory.title}${path}`;
      directory = directories[directory.directoryId];
    }
    return path;
  },
);

export const modulesInDirectorySelector = createSelector(
  (_, { id }) => id,
  (_, { sourceId }) => sourceId,
  modulesSelector,
  entriesInDirectorySelector,
);

