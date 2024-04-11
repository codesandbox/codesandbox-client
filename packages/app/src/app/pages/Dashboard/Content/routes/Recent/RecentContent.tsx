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
import { EmptyCTAs } from './EmptyCTAs';

type RecentContentProps = {
  recentItems: (DashboardSandbox | DashboardBranch)[];
  recentRepos: RepoInfo[];
  otherRepos: RepoInfo[];
};
export const RecentContent: React.FC<RecentContentProps> = ({
  recentItems,
  recentRepos,
  otherRepos,
}) => {
  const { activeTeam } = useAppState();
  const { isFrozen, hasReachedSandboxLimit } = useWorkspaceLimits();
  const page: PageTypes = 'recent';
};
