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
import { Element } from '@codesandbox/components';
import {
  GRID_MAX_WIDTH,
  GUTTER,
} from 'app/pages/Dashboard/Components/VariableGrid/constants';
import { EmptyRecent } from './EmptyRecent';

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
  const showUpgradeBanner = isFree && isTeamSpace;
  const isEmpty = !dataIsLoading && items.length === 0;

  if (isEmpty) {
    return <EmptyRecent showUpgradeBanner={showUpgradeBanner} />;
  }

  return (
    <SelectionProvider activeTeamId={activeTeam} page={pageType} items={items}>
      <Helmet>
        <title>Recent - CodeSandbox</title>
      </Helmet>
      {showUpgradeBanner && (
        <Element
          css={{
            width: `calc(100% - ${2 * GUTTER}px)`,
            maxWidth: `calc(${GRID_MAX_WIDTH}px - 2 * ${GUTTER}px)`,
            margin: '0 auto',
            paddingBottom: '48px', // Because the stack gap is 0, it overrides the margin bottom so we need to use padding.
          }}
        >
          <UpgradeBanner teamId={activeTeam} />
        </Element>
      )}
      <Header
        title="Recent"
        activeTeam={activeTeam}
        loading={dataIsLoading}
        showViewOptions
      />
      <VariableGrid page={pageType} items={items} />
    </SelectionProvider>
  );
};
