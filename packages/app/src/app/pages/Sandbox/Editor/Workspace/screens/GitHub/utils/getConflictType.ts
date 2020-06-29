import { GitFileCompare } from '@codesandbox/common/lib/types';

import { ConflictType } from '../types';

export function getConflictType(
  conflict: GitFileCompare,
  modulesByPath: { [path: string]: any }
) {
  if (conflict.status === 'added' && !modulesByPath['/' + conflict.filename]) {
    return ConflictType.SOURCE_ADDED_SANDBOX_DELETED;
  }
  if (conflict.status === 'added' && modulesByPath['/' + conflict.filename]) {
    return ConflictType.SOURCE_ADDED_SANDBOX_MODIFIED;
  }
  if (conflict.status === 'removed' && modulesByPath['/' + conflict.filename]) {
    return ConflictType.SOURCE_DELETED_SANDBOX_MODIFIED;
  }
  if (
    conflict.status === 'modified' &&
    modulesByPath['/' + conflict.filename]
  ) {
    return ConflictType.SOURCE_MODIFIED_SANDBOX_MODIFIED;
  }
  if (
    conflict.status === 'modified' &&
    !modulesByPath['/' + conflict.filename]
  ) {
    return ConflictType.SOURCE_MODIFIED_SANDBOX_DELETED;
  }

  return ConflictType.UNKNOWN;
}
