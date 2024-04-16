import React from 'react';

import { Stack, Text } from '@codesandbox/components';
import { Sandbox } from 'app/pages/Dashboard/Components/Sandbox';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';

import { Branch } from 'app/pages/Dashboard/Components/Branch';
import { StyledGrid } from 'app/pages/Dashboard/Components/shared/elements';
import {
  DashboardBranch,
  DashboardSandbox,
  PageTypes,
} from 'app/pages/Dashboard/types';

export const ItemsGrid: React.FC<{
  title: string;
  items: Array<DashboardBranch | DashboardSandbox>;
  activeTeam: string;
  page: PageTypes;
}> = ({ title, items, activeTeam, page }) => (
  <Stack direction="vertical" gap={4}>
    <Text as="h3" margin={0} size={4} weight="400">
      {title}
    </Text>

    <SelectionProvider activeTeamId={activeTeam} page={page} items={items}>
      <StyledGrid as="ul">
        {items.map(item => {
          const itemId =
            item.type === 'branch' ? item.branch.id : item.sandbox.id;

          return (
            <Stack
              as="li"
              className="recent-item"
              css={{ '> *': { width: '100%' } }}
              key={itemId}
            >
              {item.type === 'sandbox' && (
                <Sandbox isScrolling={false} item={item} page={page} />
              )}
              {item.type === 'branch' && (
                <Branch branch={item.branch} page={page} type="branch" />
              )}
            </Stack>
          );
        })}
      </StyledGrid>
    </SelectionProvider>
  </Stack>
);
