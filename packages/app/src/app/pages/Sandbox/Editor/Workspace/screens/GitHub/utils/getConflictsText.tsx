import { GitFileCompare } from '@codesandbox/common/lib/types';
import { Text } from '@codesandbox/components';
import React from 'react';

import { ConflictType } from '../types';
import { getConflictType } from './getConflictType';

export function getConflictText(
  branch: string,
  conflict: GitFileCompare,
  modulesByPath: any
) {
  const conflictType = getConflictType(conflict, modulesByPath);

  if (conflictType === ConflictType.SOURCE_ADDED_SANDBOX_DELETED) {
    return (
      <Text>
        <Text weight="bold">{branch}</Text> added this file, but it does not
        exist in this sandbox
      </Text>
    );
  }
  if (conflictType === ConflictType.SOURCE_ADDED_SANDBOX_MODIFIED) {
    return (
      <Text>
        <Text weight="bold">{branch}</Text> added this file, but you modified it
      </Text>
    );
  }
  if (conflictType === ConflictType.SOURCE_DELETED_SANDBOX_MODIFIED) {
    return (
      <Text>
        <Text weight="bold">{branch}</Text> deleted this file, but you modified
        it
      </Text>
    );
  }
  if (conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_MODIFIED) {
    return (
      <Text>
        <Text weight="bold">{branch}</Text> modified this file and you did as
        well
      </Text>
    );
  }
  if (conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_DELETED) {
    return (
      <Text>
        <Text weight="bold">{branch}</Text> modified this file, but you deleted
        it
      </Text>
    );
  }

  return 'No idea what happened here?';
}
