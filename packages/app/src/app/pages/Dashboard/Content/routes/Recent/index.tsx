import React, { useEffect } from 'react';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { Helmet } from 'react-helmet';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';

export const Recent = () => {
  const {
    activeTeam,
    dashboard: { sandboxes },
  } = useAppState();
  const {
    dashboard: { getPage },
  } = useActions();

  useEffect(() => {
    getPage(sandboxesTypes.RECENT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam]);

  const dataIsLoading =
    sandboxes.RECENT_BRANCHES === null || sandboxes.RECENT_SANDBOXES === null;

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
          // TODO: Update when sandboxes get a lastAccessedAt field
          const dateA =
            a.type === 'branch' ? a.branch.lastAccessedAt : a.sandbox.updatedAt;
          const dateB =
            b.type === 'branch' ? b.branch.lastAccessedAt : b.sandbox.updatedAt;

          return new Date(dateA) < new Date(dateB) ? 1 : -1;
          // Merge the two data sources and show only the first 24 most recent entries
        })
        .slice(0, 24);

  const pageType: PageTypes = 'recent';
  return (
    <SelectionProvider activeTeamId={activeTeam} page={pageType} items={items}>
      <Helmet>
        <title>Dashboard - CodeSandbox</title>
      </Helmet>
      <Header
        title="Pick up where you left off"
        activeTeam={activeTeam}
        showViewOptions
      />
      <VariableGrid page={pageType} items={items} />
    </SelectionProvider>
  );
};
