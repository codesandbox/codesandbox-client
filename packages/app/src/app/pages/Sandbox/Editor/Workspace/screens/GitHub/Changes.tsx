import { List, ListItem, Text } from '@codesandbox/components';
import React from 'react';

import { AddedIcon, ChangedIcon, ConflictIcon, DeletedIcon } from './Icons';

const getChanges = changes => changes.slice().sort();

export const Changes: React.FC<{
  added: string[];
  deleted: string[];
  modified: string[];
  conflicts: string[];
}> = ({ added, modified, deleted, conflicts }) => (
  <List paddingBottom={6}>
    {getChanges(added).map(change => (
      <ListItem gap={2}>
        {conflicts.includes(change) ? <ConflictIcon /> : <AddedIcon />}{' '}
        <Text variant="muted">{change}</Text>
      </ListItem>
    ))}
    {getChanges(modified).map(change => (
      <ListItem gap={2}>
        {conflicts.includes(change) ? <ConflictIcon /> : <ChangedIcon />}{' '}
        <Text variant="muted">{change}</Text>
      </ListItem>
    ))}
    {getChanges(deleted).map(change => (
      <ListItem gap={2}>
        {conflicts.includes(change) ? <ConflictIcon /> : <DeletedIcon />}{' '}
        <Text variant="muted">{change}</Text>
      </ListItem>
    ))}
  </List>
);
