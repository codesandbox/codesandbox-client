import React from 'react';
import { Helmet } from 'react-helmet';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import {
  DashboardGridItem,
  DashboardHeader,
  DashboardSandbox,
  PageTypes,
} from 'app/pages/Dashboard/types';
import { getPossibleTemplates } from '../../utils';

export const Recent = () => {
  const {
    activeTeam,
    dashboard: { sandboxes, recentSandboxesByTime, getFilteredSandboxes },
  } = useAppState();
  const {
    dashboard: { getPage },
  } = useActions();

  React.useEffect(() => {
    getPage(sandboxesTypes.RECENT);
  }, [activeTeam, getPage]);

  const getSection = (
    title: string,
    time: keyof typeof recentSandboxesByTime
  ): [DashboardHeader, ...DashboardSandbox[]] | [] => {
    const recentSandboxes = getFilteredSandboxes(recentSandboxesByTime[time]);

    if (!recentSandboxes.length) return [];

    return [
      { type: 'header', title },
      ...recentSandboxes.map(sandbox => ({
        type: 'sandbox' as 'sandbox',
        sandbox,
      })),
    ];
  };

  const items: DashboardGridItem[] = sandboxes.RECENT
    ? [
        ...getSection('Today', 'day'),
        ...getSection('Last 7 days', 'week'),
        ...getSection('Earlier this month', 'month'),
        ...getSection('Older', 'older'),
      ]
    : [
        { type: 'header', title: 'Today' },
        { type: 'skeleton-row' },
        { type: 'header', title: 'Last 7 days' },
        { type: 'skeleton-row' },
      ];

  const pageType: PageTypes = 'recents';
  return (
    <SelectionProvider page={pageType} activeTeamId={activeTeam} items={items}>
      <Helmet>
        <title>Recent Sandboxes - CodeSandbox</title>
      </Helmet>
      <Header
        title="Recently Modified Sandboxes"
        activeTeam={activeTeam}
        templates={getPossibleTemplates(sandboxes.RECENT)}
        showViewOptions
        showFilters
      />

      <VariableGrid items={items} page={pageType} />
    </SelectionProvider>
  );
};
