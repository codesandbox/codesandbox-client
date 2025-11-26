import React, { useEffect } from 'react';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Helmet } from 'react-helmet';
import { DashboardBranch, DashboardSandbox } from 'app/pages/Dashboard/types';
import { Loading, Stack } from '@codesandbox/components';
import { RepoInfo } from 'app/overmind/namespaces/sidebar/types';
import { StyledContentWrapper } from 'app/pages/Dashboard/Components/shared/elements';
import { ContentSection } from 'app/pages/Dashboard/Components/shared/ContentSection';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { TopBanner } from './TopBanner';
import { CreateBranchesRow } from './CreateBranchesRow';
import { ItemsGrid } from './ItemsGrid';
import { EmptyCTAs } from './EmptyCTAs';

export const Recent = () => {
  const {
    activeTeam,
    sidebar,
    dashboard: { sandboxes },
  } = useAppState();
  const { isFrozen } = useWorkspaceLimits();
  const {
    dashboard: { getPage, getWorkspaceSandboxes },
  } = useActions();
  const page = 'recent';

  useEffect(() => {
    getPage(sandboxesTypes.RECENT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam]);

  // TODO: Replace this useEffect with Apollo query enable/disable when migrating to Apollo
  // Fetch workspace sandboxes only when needed (when there are no recent items but there are other repos)
  useEffect(() => {
    if (
      sandboxes.RECENT_SANDBOXES !== null &&
      sandboxes.RECENT_BRANCHES !== null &&
      activeTeam &&
      sandboxes.WORKSPACE_SANDBOXES === null
    ) {
      const recentItemsCount =
        (sandboxes.RECENT_SANDBOXES || []).length +
        (sandboxes.RECENT_BRANCHES || []).length;
      const hasOtherRepos =
        (sidebar[activeTeam]?.repositories || []).length > 0;

      // Only fetch if there are no recent items but there are other repos
      // This is when we'd want to show the "Explore workspace activity" section
      if (recentItemsCount === 0 && hasOtherRepos) {
        getWorkspaceSandboxes();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeTeam,
    sandboxes.RECENT_SANDBOXES,
    sandboxes.RECENT_BRANCHES,
    sandboxes.WORKSPACE_SANDBOXES,
    sidebar,
  ]);

  if (
    sandboxes.RECENT_BRANCHES === null ||
    sandboxes.RECENT_SANDBOXES === null
  ) {
    return (
      <Stack align="center" justify="center">
        <Loading size={12} />
      </Stack>
    );
  }

  const recentItems: (DashboardSandbox | DashboardBranch)[] = [
    ...(sandboxes.RECENT_SANDBOXES || []).map(sandbox => ({
      type: 'sandbox' as const,
      sandbox,
    })),
    ...(sandboxes.RECENT_BRANCHES || []).map(branch => ({
      type: 'branch' as const,
      branch,
    })),
  ]
    .sort((a, b) => {
      const dateA =
        a.type === 'branch'
          ? a.branch.lastAccessedAt
          : a.sandbox.lastAccessedAt;
      const dateB =
        b.type === 'branch'
          ? b.branch.lastAccessedAt
          : b.sandbox.lastAccessedAt;

      return new Date(dateA) < new Date(dateB) ? 1 : -1;
      // Merge the two data sources and show only the first 18 most recent entries
    })
    .slice(0, 18);

  const recentBranches = recentItems.filter(
    item => item.type === 'branch'
  ) as DashboardBranch[];

  const recentRepos: RepoInfo[] = recentBranches
    .map(br => ({
      owner: br.branch.project.repository.owner,
      name: br.branch.project.repository.name,
      defaultBranch: br.branch.project.repository.defaultBranch,
    }))
    .reduce((acc, repo) => {
      if (!acc.some(r => r.owner === repo.owner && r.name === repo.name)) {
        acc.push(repo);
      }
      return acc;
    }, []);

  const allWorkspaceRepos = sidebar[activeTeam]?.repositories || [];
  const otherRepos = allWorkspaceRepos.filter(
    wr => !recentRepos.find(r => r.owner === wr.owner && r.name === wr.name)
  );

  // Filter out sandboxes that are already in recentItems
  const recentSandboxIds = new Set(
    recentItems
      .filter((item): item is DashboardSandbox => item.type === 'sandbox')
      .map(item => item.sandbox.id)
  );

  const otherSandboxes: DashboardSandbox[] = (
    sandboxes.WORKSPACE_SANDBOXES || []
  )
    .filter(sandbox => !recentSandboxIds.has(sandbox.id))
    .slice(0, 10) // Limit to 10 for display
    .map(sandbox => ({
      type: 'sandbox' as const,
      sandbox,
    }));

  return (
    <StyledContentWrapper>
      <Helmet>
        <title>Recent - CodeSandbox</title>
      </Helmet>

      <TopBanner />

      <ContentSection title="Recent">
        {recentRepos.length > 0 && (
          <CreateBranchesRow
            title="Create a new branch"
            isFrozen={isFrozen}
            repos={recentRepos}
            trackEvent="Recent Page - Repositories - Create new branch"
          />
        )}

        {recentItems.length > 0 ? (
          <ItemsGrid
            title="Pick up where you left off"
            items={recentItems}
            page={page}
            activeTeam={activeTeam}
          />
        ) : (
          <EmptyCTAs isFrozen={isFrozen} />
        )}
      </ContentSection>

      {recentItems.length === 0 &&
        otherRepos.length > 0 &&
        otherSandboxes.length > 0 && (
          <ContentSection title="Explore workspace activity">
            {otherRepos.length > 0 && (
              <CreateBranchesRow
                title="Create a branch from a workspace repository"
                repos={otherRepos}
                isFrozen={isFrozen}
                trackEvent="Recent Page - Explore workspace - Create new branch"
              />
            )}

            {otherSandboxes.length > 0 && (
              <ItemsGrid
                title="Open a workspace Sandbox or Devbox"
                items={otherSandboxes}
                page={page}
                activeTeam={activeTeam}
              />
            )}
          </ContentSection>
        )}
    </StyledContentWrapper>
  );
};
