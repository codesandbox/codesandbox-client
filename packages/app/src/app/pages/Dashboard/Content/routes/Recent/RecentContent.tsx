import React from 'react';
import styled from 'styled-components';

import { Element, Stack, Text } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { Branch } from 'app/pages/Dashboard/Components/Branch';
import { ViewOptions } from 'app/pages/Dashboard/Components/Filters/ViewOptions';
import { Sandbox } from 'app/pages/Dashboard/Components/Sandbox';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { TemplatesRow } from 'app/pages/Dashboard/Components/TemplatesRow';
import { SuggestionsRow } from 'app/pages/Dashboard/Components/SuggestionsRow/SuggestionsRow';
import {
  GRID_MAX_WIDTH,
  ITEM_MIN_WIDTH,
  ITEM_HEIGHT_GRID,
  ITEM_HEIGHT_LIST,
  GUTTER,
} from 'app/pages/Dashboard/Components/VariableGrid/constants';
import {
  DashboardBranch,
  DashboardSandbox,
  PageTypes,
} from 'app/pages/Dashboard/types';

import { useGitHubPermissions } from 'app/hooks/useGitHubPermissions';
import { DocumentationRow } from './DocumentationRow';
import { RecentHeader } from './RecentHeader';

const StyledWrapper = styled(Stack)`
  width: 100%;
  max-width: ${GRID_MAX_WIDTH}px;
  padding: 0 calc(2 * ${GUTTER}px) 64px;
  overflow: auto;
  margin: 28px auto 0;
  flex-direction: column;
  gap: 48px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const StyledItemsWrapper = styled(Element)<{ viewMode: 'grid' | 'list' }>`
  display: grid;

  ${props =>
    props.viewMode === 'grid' &&
    `
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(${ITEM_MIN_WIDTH}px, 1fr));
    grid-auto-rows: minmax(${ITEM_HEIGHT_GRID}px, 1fr);
  `}

  ${props =>
    props.viewMode === 'list' &&
    `
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(${ITEM_HEIGHT_LIST}px, 1fr);
  `}
`;

type RecentContentProps = {
  recentItems: (DashboardSandbox | DashboardBranch)[];
};
export const RecentContent: React.FC<RecentContentProps> = ({
  recentItems,
}) => {
  const {
    activeTeam,
    dashboard: { viewMode },
  } = useAppState();
  const { restrictsPublicRepos } = useGitHubPermissions();
  const page: PageTypes = 'recent';

  return (
    <StyledWrapper>
      <RecentHeader title="Recent" />
      <Stack direction="vertical" gap={4}>
        <Stack justify="space-between">
          <Text as="h2" lineHeight="25px" margin={0} size={16} weight="400">
            Pick up where you left off
          </Text>
          <ViewOptions />
        </Stack>

        <SelectionProvider
          activeTeamId={activeTeam}
          page={page}
          items={recentItems}
        >
          <StyledItemsWrapper
            as="ul"
            css={{
              listStyleType: 'none',
              margin: 0,
              padding: 0,
            }}
            viewMode={viewMode}
          >
            {recentItems.map(item => {
              const itemId =
                item.type === 'branch' ? item.branch.id : item.sandbox.id;

              return (
                <Stack as="li" css={{ '> *': { width: '100%' } }} key={itemId}>
                  {item.type === 'sandbox' && (
                    <Sandbox isScrolling={false} item={item} page={page} />
                  )}
                  {item.type === 'branch' && (
                    <Branch branch={item.branch} page={page} type="branch" />
                  )}
                </Stack>
              );
            })}
          </StyledItemsWrapper>
        </SelectionProvider>
      </Stack>
      <DocumentationRow />
      <TemplatesRow />
      {restrictsPublicRepos === false && <SuggestionsRow page="recent" />}
    </StyledWrapper>
  );
};
