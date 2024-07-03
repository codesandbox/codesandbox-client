import { Collapsible, List, ListItem } from '@codesandbox/components';
import React from 'react';

import { SkeletonTextBlock } from 'app/components/Skeleton/elements';

export const Loading = () => (
  <Collapsible title="GitHub Repository" defaultOpen>
    <List css={{ marginBottom: '32px' }}>
      <ListItem justify="space-between">
        <SkeletonTextBlock />
      </ListItem>
      <ListItem justify="space-between">
        <SkeletonTextBlock />
      </ListItem>
      <ListItem justify="space-between">
        <SkeletonTextBlock />
      </ListItem>
    </List>
  </Collapsible>
);
