import React from 'react';

import { Stack, Text } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { useActions, useAppState } from 'app/overmind';
import { Sandbox } from 'app/pages/Dashboard/Components/Sandbox';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import {
  DashboardBranch,
  DashboardSandbox,
  PageTypes,
} from 'app/pages/Dashboard/types';

import { Branch } from 'app/pages/Dashboard/Components/Branch';
import { ActionCard } from 'app/pages/Dashboard/Components/shared/ActionCard';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import {
  StyledContentWrapper,
  StyledGrid,
} from 'app/pages/Dashboard/Components/shared/elements';
import { RestrictedSandboxes } from 'app/components/StripeMessages/RestrictedSandboxes';
import { ContentSection } from 'app/pages/Dashboard/Components/shared/ContentSection';
import { TopBanner } from './TopBanner';

type RecentContentProps = {
  recentItems: (DashboardSandbox | DashboardBranch)[];
};
export const RecentContent: React.FC<RecentContentProps> = ({
  recentItems,
}) => {
  const { activeTeam } = useAppState();
  const actions = useActions();
  const { isFrozen, hasReachedSandboxLimit } = useWorkspaceLimits();
  const page: PageTypes = 'recent';
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
    <StyledContentWrapper>
      {hasReachedSandboxLimit && <RestrictedSandboxes />}
      <TopBanner />

      <ContentSection title="Recent">
        {uniqueRecentRepos.length > 0 && (
          <Stack direction="vertical" gap={4}>
            <Text as="h2" lineHeight="25px" margin={0} size={16} weight="400">
              Create a new branch
            </Text>

            <StyledGrid>
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
            </StyledGrid>
          </Stack>
        )}
        <Stack direction="vertical" gap={4}>
          <Text as="h2" lineHeight="25px" margin={0} size={16} weight="400">
            Pick up where you left off
          </Text>

          <SelectionProvider
            activeTeamId={activeTeam}
            page={page}
            items={recentItems}
          >
            <StyledGrid>
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
            </StyledGrid>
          </SelectionProvider>
        </Stack>
      </ContentSection>
    </StyledContentWrapper>
  );
};
