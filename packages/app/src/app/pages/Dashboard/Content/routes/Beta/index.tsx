import React from 'react';
import { Helmet } from 'react-helmet';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';

export const BetaRepositoriesPage = () => {
  const actions = useActions();
  const {
    activeTeam,
    dashboard: { sandboxes, getFilteredSandboxes },
  } = useAppState();

  React.useEffect(() => {
    actions.dashboard.getSharedSandboxesBeta();
  }, [actions.dashboard]);

  const items: DashboardGridItem[] = sandboxes.SHARED_BETA
    ? getFilteredSandboxes(sandboxes.SHARED_BETA).map(sandbox => ({
        type: 'sandbox',
        sandbox,
      }))
    : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];

  const pageType: PageTypes = 'repos';

  console.log(items);

  return (
    <SelectionProvider page={pageType} activeTeamId={activeTeam} items={items}>
      <Helmet>
        <title>Beta repositories - CodeSandbox</title>
      </Helmet>
      <Header
        activeTeam={activeTeam}
        repos
        path="Beta"
        showViewOptions
        showFilters={false}
        showSortOptions={false}
      />
      <VariableGrid page={pageType} items={items} />
    </SelectionProvider>
  );
};

export const Repositories = React.memo(BetaRepositoriesPage);
