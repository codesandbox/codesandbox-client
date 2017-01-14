import { createSelector } from 'reselect';
import { values } from 'lodash';

import { singleSandboxSelector } from '../sandboxes/selector';
import resolveModule from '../../../../sandbox/utils/resolve-module';
import { directoriesBySandboxSelector } from '../directories/selector';
import { entriesInDirectorySelector } from '../../selectors/entry-selectors';
import {currentTabSelector} from '../../selectors/views/sandbox-selector';

export const modulesSelector = state => state.entities.modules;
export const defaultModuleSelector = state => modulesSelector(state).default;
export const singleModuleSelector = (state, { id }) => (
  modulesSelector(state)[id] || defaultModuleSelector(state)
);

export const modulesBySandboxSelector = createSelector(
  singleSandboxSelector,
  modulesSelector,
  (sandbox, modules) => {
    if (sandbox == null) return [];

    return values(modules).filter(m => m.sourceId === sandbox.source);
  },
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

export const modulesInDirectorySelector = createSelector(
  (_, { id }) => id,
  (_, { sourceId }) => sourceId,
  modulesSelector,
  entriesInDirectorySelector,
);

