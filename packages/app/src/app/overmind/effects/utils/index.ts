import { resolveModule } from '@codesandbox/common/lib/sandbox/modules';
import { isEqual } from 'lodash-es';

let nextOptimisticId = 0;
export const OPTIMISTIC_ID_PREFIX = 'OPTIMISTIC_';

export default {
  createOptimisticId() {
    return OPTIMISTIC_ID_PREFIX + nextOptimisticId++;
  },
  resolveModule,
  isEqual,
};
