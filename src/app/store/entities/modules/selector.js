import { createSelector } from 'reselect';
import { values, sortBy } from 'lodash';

import { singleSandboxSelector } from '../sandboxes/selector';

export const modulesSelector = state => state.entities.modules;
export const defaultModuleSelector = state => modulesSelector(state).default;
export const singleModuleSelector = (state, { id }) => (
  modulesSelector(state)[id] || defaultModuleSelector(state)
);

export const getModuleChildren = (module, modules) => (
  sortBy(values(modules).filter(m => m.parentModuleId === module.id), m => m.title.toUpperCase())
);

export const moduleChildrenSelector = createSelector(
  singleModuleSelector,
  modulesSelector,
  getModuleChildren,
);

export const modulesBySandboxSelector = createSelector(
  singleSandboxSelector,
  modulesSelector,
  (sandbox, modules) => {
    if (sandbox == null) return [];

    return values(modules).filter(m => m.sandboxId === sandbox.id);
  },
);
