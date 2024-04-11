import React from 'react';

import { Stack } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import {
  DashboardBranch,
  DashboardSandbox,
  PageTypes,
} from 'app/pages/Dashboard/types';

import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { StyledContentWrapper } from 'app/pages/Dashboard/Components/shared/elements';
import { RestrictedSandboxes } from 'app/components/StripeMessages/RestrictedSandboxes';
import { ContentSection } from 'app/pages/Dashboard/Components/shared/ContentSection';
import { RepoInfo } from 'app/overmind/namespaces/sidebar/types';
import { TopBanner } from './TopBanner';
import { CreateBranchesRow } from './CreateBranchesRow';
import { ItemsGrid } from './ItemsGrid';

type RecentContentProps = {
  recentItems: (DashboardSandbox | DashboardBranch)[];
  recentRepos: RepoInfo[];
};
export const RecentContent: React.FC<RecentContentProps> = ({
  recentItems,
  recentRepos,
}) => {
  const { activeTeam } = useAppState();
  const { isFrozen, hasReachedSandboxLimit } = useWorkspaceLimits();
  const page: PageTypes = 'recent';

  return (
    <StyledContentWrapper>
      <Stack direction="vertical" gap={4}>
        {hasReachedSandboxLimit && <RestrictedSandboxes />}
        <TopBanner />
      </Stack>

      <ContentSection title="Recent">
        {recentRepos.length > 0 && (
          <CreateBranchesRow
            title="Create a new branch"
            isFrozen={isFrozen}
            repos={recentRepos}
            trackEvent="Recent Page - Repositories - Create new branch"
          />
        )}

        {recentItems.length > 0 && (
          <ItemsGrid
            title="Pick up where you left off"
            items={recentItems}
            page={page}
            activeTeam={activeTeam}
          />
        )}
      </ContentSection>
    </StyledContentWrapper>
  );
};
