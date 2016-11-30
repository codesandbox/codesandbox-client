import { createSelector } from 'reselect';
import { values, sortBy } from 'lodash';

import { singleSandboxBySlugSelector } from '../sandboxes/selector';

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

export const modulesBySandboxSlugSelector = createSelector(
  singleSandboxBySlugSelector,
  modulesSelector,
  (sandbox, modules) => {
    if (sandbox == null) return [];

    return values(modules).filter(m => m.sandboxId === sandbox.id);
  },
);
