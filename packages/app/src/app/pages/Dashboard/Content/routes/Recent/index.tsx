import React, { useEffect } from 'react';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { Helmet } from 'react-helmet';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { UpgradeBanner } from 'app/pages/Dashboard/Components/UpgradeBanner';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { EmptyRecent } from './EmptyRecent';

export const Recent = () => {
  const {
    activeTeamInfo,
    dashboard: { sandboxes },
  } = useAppState();
  const {
    dashboard: { getPage },
  } = useActions();

  const activeTeamId = activeTeamInfo?.id;

  useEffect(() => {
    getPage(sandboxesTypes.RECENT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeamId]);

  const dataIsLoading =
    sandboxes.RECENT_BRANCHES === null || sandboxes.RECENT_SANDBOXES === null;

  const { isFree } = useWorkspaceSubscription();
  const { isTeamSpace } = useWorkspaceAuthorization();

  const items: DashboardGridItem[] = dataIsLoading
    ? [
        { type: 'skeleton-row' },
        { type: 'skeleton-row' },
        { type: 'skeleton-row' },
      ]
    : [
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
          // Merge the two data sources and show only the first 12 most recent entries
        })
        .slice(0, 12);

  const pageType: PageTypes = 'recent';
  const isEmpty = !dataIsLoading && items.length === 0;

  return (
    <SelectionProvider
      activeTeamId={activeTeamId}
      page={pageType}
      items={items}
    >
      <Helmet>
        <title>Recent - CodeSandbox</title>
      </Helmet>
      {isFree && isTeamSpace && <UpgradeBanner teamId={activeTeamId} />}
      <Header
        title={isEmpty ? "Let's start building" : 'Recent'}
        activeTeam={activeTeamId}
        loading={dataIsLoading}
        showViewOptions
      />

      {items.length > 0 ? (
        <VariableGrid page={pageType} items={items} />
      ) : (
        <EmptyRecent />
      )}
    </SelectionProvider>
  );
};
