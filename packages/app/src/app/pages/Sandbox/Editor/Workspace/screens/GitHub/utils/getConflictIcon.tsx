import { GitFileCompare } from '@codesandbox/common/lib/types';
import React from 'react';

import { AddedIcon, ChangedIcon, DeletedIcon } from '../Icons';
import { ConflictType } from '../types';
import { getConflictType } from './getConflictType';

export function getConflictIcon(conflict: GitFileCompare, modulesByPath: any) {
  const conflictType = getConflictType(conflict, modulesByPath);

  if (
    conflictType === ConflictType.SOURCE_ADDED_SANDBOX_MODIFIED ||
    conflictType === ConflictType.SOURCE_ADDED_SANDBOX_DELETED
  ) {
    return <AddedIcon />;
  }

  if (
    conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_DELETED ||
    conflictType === ConflictType.SOURCE_MODIFIED_SANDBOX_MODIFIED
  ) {
    return <ChangedIcon />;
  }

  if (conflictType === ConflictType.SOURCE_DELETED_SANDBOX_MODIFIED) {
    return <DeletedIcon />;
  }

  return 'No idea what happened here?';
}
