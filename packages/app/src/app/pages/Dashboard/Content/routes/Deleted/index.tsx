import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { SandboxFragmentDashboardFragment } from 'app/graphql/types';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { getPossibleTemplates } from '../../utils';

const DESCRIPTION =
  'Drag sandboxes or templates to this page to delete them.<br />Any deleted sandboxes or templates will be permanentely excluded after 30 days.';

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
  const isEmpty = items.length === 0;

  return (
    <SelectionProvider activeTeamId={activeTeam} page={pageType} items={items}>
      <Helmet>
        <title>Recently deleted - CodeSandbox</title>
      </Helmet>
      <Header
        title="Recently deleted"
        activeTeam={activeTeam}
        showFilters={!isEmpty}
        showSortOptions={!isEmpty}
        templates={getPossibleTemplates(sandboxes.DELETED)}
      />
      {isEmpty ? (
        <EmptyPage.StyledWrapper>
          <EmptyPage.StyledDescription
            as="p"
            dangerouslySetInnerHTML={{ __html: DESCRIPTION }}
          />
        </EmptyPage.StyledWrapper>
      ) : (
        <VariableGrid page={pageType} items={items} />
      )}
    </SelectionProvider>
  );
};
