import { List, ListItem, Text } from '@codesandbox/components';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { AddedIcon, DeletedIcon, ChangedIcon } from './Icons';

const getChanges = changes => changes.slice().sort();

export const Changes: FunctionComponent = () => {
  const {
    state: {
      git: {
        originalGitChanges: { added, modified, deleted },
      },
    },
  } = useOvermind();

  return (
    <List paddingBottom={6}>
      {getChanges(added).map(change => (
        <ListItem gap={2}>
          <AddedIcon />

          <Text variant="muted">{change}</Text>
        </ListItem>
      ))}

      {getChanges(modified).map(change => (
        <ListItem gap={2}>
          <ChangedIcon />

          <Text variant="muted">{change}</Text>
        </ListItem>
      ))}

      {getChanges(deleted).map(change => (
        <ListItem gap={2}>
          <DeletedIcon />

          <Text variant="muted">{change}</Text>
        </ListItem>
      ))}
    </List>
  );
};
