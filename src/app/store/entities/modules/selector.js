import { createSelector } from 'reselect';

import { singleSandboxBySlugSelector } from '../sandboxes/selector';

export const modulesSelector = state => state.entities.modules;
export const defaultModuleSelector = state => modulesSelector(state).default;
export const singleModuleSelector = (state, { id }) => (
  modulesSelector(state)[id] || defaultModuleSelector(state)
);

export const modulesBySandboxSlugSelector = createSelector(
  singleSandboxBySlugSelector,
  modulesSelector,
  (sandbox, modules) => (sandbox ? sandbox.modules.map(id => modules[id]) : []),
);
