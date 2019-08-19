import { fromPairs, toPairs, sortBy } from 'lodash-es';
import { Module } from '@codesandbox/common/lib/types';

export function sortObjectByKeys(object) {
  return fromPairs(sortBy(toPairs(object)));
}

export function createOptimisticModule(overrides: Partial<Module>) {
  return Object.assign(
    {
      id: null,
      title: '',
      directoryShortid: null,
      code: '',
      savedCode: null,
      shortid: null,
      isBinary: false,
      sourceId: null,
      insertedAt: new Date().toString(),
      updatedAt: new Date().toString(),
      isNotSynced: true,
    },
    overrides
  );
}
