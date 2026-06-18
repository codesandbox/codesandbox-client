import React, { useEffect } from 'react';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Helmet } from 'react-helmet';
import { DashboardSandbox } from 'app/pages/Dashboard/types';
import { Loading, Stack } from '@codesandbox/components';
import { StyledContentWrapper } from 'app/pages/Dashboard/Components/shared/elements';
import { ContentSection } from 'app/pages/Dashboard/Components/shared/ContentSection';
import { RepositoriesRemovedStripe } from 'app/pages/Dashboard/Components/shared/RepositoriesRemovedStripe';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { TopBanner } from './TopBanner';
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

  // Repositories have been removed from the dashboard (deprecated July 15th),
  // so "Pick up where you left off" only shows sandboxes/devboxes and excludes
  // any repository branches.
  const recentItems: DashboardSandbox[] = (sandboxes.RECENT_SANDBOXES || [])
    .map(sandbox => ({
      type: 'sandbox' as const,
      sandbox,
    }))
    .sort((a, b) =>
      new Date(a.sandbox.lastAccessedAt) < new Date(b.sandbox.lastAccessedAt)
        ? 1
        : -1
    )
    // Show only the first 18 most recent entries
    .slice(0, 18);

  // Used to surface the removal banner to anyone who still has imported repos.
  const hasRepositories = (sidebar[activeTeam]?.repositories || []).length > 0;

  // Filter out sandboxes that are already in recentItems
  const recentSandboxIds = new Set(recentItems.map(item => item.sandbox.id));

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

      {hasRepositories && <RepositoriesRemovedStripe />}

      <ContentSection title="Recent">
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
        hasRepositories &&
        otherSandboxes.length > 0 && (
          <ContentSection title="Explore workspace activity">
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
