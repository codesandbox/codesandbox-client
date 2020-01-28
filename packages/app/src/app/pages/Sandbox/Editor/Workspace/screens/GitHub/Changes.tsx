import React from 'react';
import { Text, List, ListAction } from '@codesandbox/components';
import { AddedIcon, DeletedIcon, ChangedIcon } from './Icons';

const getChanges = changes => changes.slice().sort();

export const Changes = ({ added, modified, deleted }) => (
  <List paddingBottom={6}>
    {getChanges(added).map(change => (
      <ListAction gap={2}>
        <AddedIcon /> <Text variant="muted">{change}</Text>
      </ListAction>
    ))}
    {getChanges(modified).map(change => (
      <ListAction gap={2}>
        <DeletedIcon /> <Text variant="muted">{change}</Text>
      </ListAction>
    ))}
    {getChanges(deleted).map(change => (
      <ListAction gap={2}>
        <ChangedIcon /> <Text variant="muted">{change}</Text>
      </ListAction>
    ))}
  </List>
);
