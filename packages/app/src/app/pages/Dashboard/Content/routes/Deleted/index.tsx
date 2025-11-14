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
import { Loading } from '@codesandbox/components';

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
    : null;

  const pageType: PageTypes = 'deleted';
  let pageState: 'loading' | 'ready' | 'empty';
  if (!items) {
    pageState = 'loading';
  } else if (items.length > 0) {
    pageState = 'ready';
  } else {
    pageState = 'empty';
  }

  return (
    <SelectionProvider activeTeamId={activeTeam} page={pageType} items={items}>
      <Helmet>
        <title>Recently deleted - CodeSandbox</title>
      </Helmet>
      <Header
        title="Recently deleted"
        activeTeam={activeTeam}
        showSortOptions={pageState === 'ready'}
      />
      {pageState === 'loading' && (
        <EmptyPage.StyledWrapper
          css={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Loading size={12} />
        </EmptyPage.StyledWrapper>
      )}
      {pageState === 'empty' && (
        <EmptyPage.StyledWrapper>
          <EmptyPage.StyledDescription
            as="p"
            dangerouslySetInnerHTML={{ __html: DESCRIPTION }}
          />
        </EmptyPage.StyledWrapper>
      )}
      {pageState === 'ready' && <VariableGrid page={pageType} items={items} />}
    </SelectionProvider>
  );
};
