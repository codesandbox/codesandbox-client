import React, { useEffect } from 'react';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import {
  GRID_MAX_WIDTH,
  GUTTER,
  VariableGrid,
} from 'app/pages/Dashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { Helmet } from 'react-helmet';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { Element } from '@codesandbox/components';
import { UpgradeBanner } from 'app/pages/Dashboard/Components/UpgradeBanner';
import {
  SubscriptionStatus,
  SubscriptionType,
  TeamMemberAuthorization,
} from 'app/graphql/types';

export const Recent = () => {
  const {
    activeTeamInfo,
    activeWorkspaceAuthorization,
    dashboard: { sandboxes },
    personalWorkspaceId,
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

  const subscriptionType = activeTeamInfo?.subscription?.type;
  const subscriptionStatus = activeTeamInfo?.subscription?.status;

  const isPro =
    subscriptionType === SubscriptionType.TeamPro &&
    [SubscriptionStatus.Active, SubscriptionStatus.Trialing].includes(
      subscriptionStatus
    );

  const isPersonalWorkspace = personalWorkspaceId === activeTeamId;
  const elligibleForTrial =
    !isPersonalWorkspace && !activeTeamInfo?.subscription;

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
        <title>Dashboard - CodeSandbox</title>
      </Helmet>
      {!isPro && (
        <Element
          css={{
            width: `calc(100% - ${2 * GUTTER}px)`,
            maxWidth: GRID_MAX_WIDTH - 2 * GUTTER,
            margin: '0 auto 28px',
          }}
        >
          <UpgradeBanner
            elligibleForTrial={elligibleForTrial}
            isAdmin={
              activeWorkspaceAuthorization === TeamMemberAuthorization.Admin
            }
            teamId={activeTeamId}
          />
        </Element>
      )}
      <Header
        title={isEmpty ? "Let's start building" : 'Recent'}
        activeTeam={activeTeamId}
        loading={dataIsLoading}
        showViewOptions
      />
      <VariableGrid page={pageType} items={items} />
    </SelectionProvider>
  );
};
