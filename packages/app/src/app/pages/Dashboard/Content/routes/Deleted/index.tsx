import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { SandboxFragmentDashboardFragment } from 'app/graphql/types';
import { getPossibleTemplates } from '../../utils';

export const Deleted = () => {
  const {
    activeTeam,
    dashboard: { deletedSandboxesByTime, getFilteredSandboxes, sandboxes },
  } = useAppState();
  const {
    dashboard: { getPage },
  } = useActions();

  useEffect(() => {
    getPage(sandboxesTypes.DELETED);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam]);

  const getSection = (
    title: string,
    deletedSandboxes: SandboxFragmentDashboardFragment[]
  ): DashboardGridItem[] => {
    if (!deletedSandboxes.length) return [];

    return [
      { type: 'header', title },
      ...deletedSandboxes.map(sandbox => ({
        type: 'sandbox' as 'sandbox',
        sandbox,
      })),
    ];
  };

  const items: DashboardGridItem[] = sandboxes.DELETED
    ? [
        ...getSection(
          'Deleted this week',
          getFilteredSandboxes(deletedSandboxesByTime.week)
        ),
        ...getSection(
          'Deleted earlier',
          getFilteredSandboxes(deletedSandboxesByTime.older)
        ),
      ]
    : [
        { type: 'header', title: 'Deleted this week' },
        { type: 'skeleton-row' },
        { type: 'header', title: 'Deleted earlier' },
        { type: 'skeleton-row' },
      ];

  const pageType: PageTypes = 'deleted';

  return (
    <SelectionProvider activeTeamId={activeTeam} page={pageType} items={items}>
      <Helmet>
        <title>Deleted sandboxes - CodeSandbox</title>
      </Helmet>
      <Header
        title="Recently deleted"
        activeTeam={activeTeam}
        showFilters
        showSortOptions
        templates={getPossibleTemplates(sandboxes.DELETED)}
      />
      <VariableGrid page={pageType} items={items} />
    </SelectionProvider>
  );
};
