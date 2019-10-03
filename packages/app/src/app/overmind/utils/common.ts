import { Module } from '@codesandbox/common/lib/types';
import { fromPairs, sortBy, toPairs } from 'lodash-es';

export function sortObjectByKeys(object) {
  return fromPairs(sortBy(toPairs(object)));
}

export function createOptimisticModule(overrides: Partial<Module>) {
  return {
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
    errors: [],
    corrections: [],
    type: 'file' as 'file',
    ...overrides,
  };
}
