import React from 'react';
import { Text, List, ListItem } from '@codesandbox/components';
import { AddedIcon, DeletedIcon, ChangedIcon } from './Icons';

const getChanges = changes => changes.slice().sort();

export const Changes = ({ added, modified, deleted }) => (
  <List paddingBottom={6}>
    {getChanges(added).map(change => (
      <ListItem gap={2}>
        <AddedIcon /> <Text variant="muted">{change}</Text>
      </ListItem>
    ))}
    {getChanges(modified).map(change => (
      <ListItem gap={2}>
        <DeletedIcon /> <Text variant="muted">{change}</Text>
      </ListItem>
    ))}
    {getChanges(deleted).map(change => (
      <ListItem gap={2}>
        <ChangedIcon /> <Text variant="muted">{change}</Text>
      </ListItem>
    ))}
  </List>
);
