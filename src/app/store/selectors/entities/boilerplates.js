import { createSelector } from 'reselect';
import { values } from 'lodash';

import { singleSandboxSelector } from '../sandboxes/selector';
import defaultBoilerplates from './default-boilerplates';

export const boilerplatesSelector = state => state.entities.boilerplates;

export const boilerplatesBySandboxSelector = createSelector(
  singleSandboxSelector,
  boilerplatesSelector,
  (sandbox, boilerplates) =>
    // put defaultboilerplates last, so custom boilerplates always have priority
    [...values(boilerplates).filter(b => b.sourceId === sandbox.source), ...defaultBoilerplates],
);
