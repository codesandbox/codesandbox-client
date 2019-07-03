import { fromPairs, toPairs, sortBy } from 'lodash-es';

export function sortObjectByKeys(object) {
  return fromPairs(sortBy(toPairs(object)));
}
