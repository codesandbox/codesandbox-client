import React from 'react';
import styled from 'styled-components';

import { Element, Stack, Text } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { useActions, useAppState } from 'app/overmind';
import { ViewOptions } from 'app/pages/Dashboard/Components/Filters/ViewOptions';
import { Sandbox } from 'app/pages/Dashboard/Components/Sandbox';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
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
import { Branch } from 'app/pages/Dashboard/Components/Branch';
import { ActionCard } from 'app/pages/Dashboard/Components/shared/ActionCard';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { DocumentationRow } from './DocumentationRow';
import { RecentHeader } from './RecentHeader';

const StyledWrapper = styled(Stack)`
  width: 100%;
  max-width: ${GRID_MAX_WIDTH}px;
  padding: 0 calc(2 * ${GUTTER}px) 64px;
  overflow: auto;
  margin: 28px auto 0;
  flex-direction: column;
  gap: 32px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const StyledItemsWrapper = styled(Element)<{ viewMode: 'grid' | 'list' }>`
  display: grid;
  list-style-type: none;
  margin: 0;
  padding: 0;

  @media (width <= 1149px) {
    & li.create-branch:not(:nth-child(-n + 4)) {
      display: none;
    }
  }

  @media (width <= 1425px) {
    & li.create-branch:not(:nth-child(-n + 3)) {
      display: none;
    }
  }

  @media (width <= 1702px) {
    & li.recent-item:not(:nth-child(-n + 12)) {
      display: none;
    }
    & li.create-branch:not(:nth-child(-n + 4)) {
      display: none;
    }
  }

  @media (1702px < width <= 1978px) {
    & li.recent-item:not(:nth-child(-n + 15)) {
      display: none;
    }
    & li.create-branch:not(:nth-child(-n + 5)) {
      display: none;
    }
  }

  @media (1978px < width <= 2254px) {
    & li.recent-item:not(:nth-child(-n + 18)) {
      display: none;
    }
    & li.create-branch:not(:nth-child(-n + 6)) {
      display: none;
    }
  }

  @media (2254px < width <= 2530px) {
    & li.recent-item:not(:nth-child(-n + 14)) {
      display: none;
    }
    & li.create-branch:not(:nth-child(-n + 7)) {
      display: none;
    }
  }

  @media (2530px < width <= 2806px) {
    & li.recent-item:not(:nth-child(-n + 16)) {
      display: none;
    }
    & li.create-branch:not(:nth-child(-n + 8)) {
      display: none;
    }
  }

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
    environment: { isOnPrem },
    dashboard: { viewMode },
  } = useAppState();
  const actions = useActions();
  const { isFrozen } = useWorkspaceLimits();
  const { restrictsPublicRepos } = useGitHubPermissions();
  const page: PageTypes = 'recent';
  const showRepositoryImport =
    !isOnPrem && !isFrozen && restrictsPublicRepos === false;
  const showDocsLine = !isOnPrem;
  const branches = recentItems.filter(
    item => item.type === 'branch'
  ) as DashboardBranch[];

  const uniqueRecentRepos = branches
    .map(br => ({
      owner: br.branch.project.repository.owner,
      name: br.branch.project.repository.name,
      default: br.branch.project.repository.defaultBranch,
    }))
    .reduce((acc, repo) => {
      if (!acc.some(r => r.owner === repo.owner && r.name === repo.name)) {
        acc.push(repo);
      }
      return acc;
    }, [] as { owner: string; name: string; default: string }[])
    .slice(0, 8); // Enure only a single line max is filled

  return (
    <StyledWrapper>
      <RecentHeader title="Recent" />

      {uniqueRecentRepos.length > 0 && (
        <Stack direction="vertical" gap={4}>
          <Text as="h2" lineHeight="25px" margin={0} size={16} weight="400">
            Create a new branch
          </Text>

          <StyledItemsWrapper as="ul" viewMode={viewMode}>
            {uniqueRecentRepos.map(repo => {
              return (
                <Stack
                  as="li"
                  className="create-branch"
                  css={{ '> *': { width: '100%' } }}
                  key={`${repo.owner}/${repo.name}`}
                >
                  <ActionCard
                    onClick={evt => {
                      track('Recent Page - Create new branch');

                      actions.dashboard.createDraftBranch({
                        owner: repo.owner,
                        name: repo.name,
                        teamId: activeTeam,
                        openInNewTab: evt.ctrlKey || evt.metaKey,
                      });
                    }}
                    icon="branch"
                    disabled={isFrozen}
                  >
                    <Stack gap={1} direction="vertical">
                      <Text truncate weight="500">
                        {repo.name}
                      </Text>
                      <Text variant="muted">
                        Create new branch from{' '}
                        <Text color="#e5e5e5" weight="500">
                          {repo.default}
                        </Text>
                      </Text>
                    </Stack>
                  </ActionCard>
                </Stack>
              );
            })}
          </StyledItemsWrapper>
        </Stack>
      )}
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
          <StyledItemsWrapper as="ul" viewMode={viewMode}>
            {recentItems.map(item => {
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
          </StyledItemsWrapper>
        </SelectionProvider>
      </Stack>
      {showDocsLine && <DocumentationRow />}
      {showRepositoryImport && <SuggestionsRow page="recent" />}
    </StyledWrapper>
  );
};
