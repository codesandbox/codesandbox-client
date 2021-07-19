import React from 'react';
import { Helmet } from 'react-helmet';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import {
  DashboardBetaRepo,
  DashboardGridItem,
  PageTypes,
} from 'app/pages/Dashboard/types';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';

export const BetaRepositoriesPage = () => {
  const actions = useActions();
  const {
    activeTeam,
    dashboard: { sandboxes },
  } = useAppState();

  React.useEffect(() => {
    actions.dashboard.getBetaSandboxes();
  }, [actions.dashboard]);

  const items: DashboardGridItem[] = sandboxes.BETA
    ? [
        { type: 'beta-new-repo' },
        ...sandboxes.BETA.map(sandbox => ({
          type: 'beta-repo' as DashboardBetaRepo['type'],
          sandbox,
        })),
      ]
    : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];

  const pageType: PageTypes = 'repos';

  return (
    <SelectionProvider page={pageType} activeTeamId={activeTeam} items={items}>
      <Helmet>
        <title>Beta repositories - CodeSandbox</title>
      </Helmet>
      <Header
        activeTeam={activeTeam}
        repos
        path="Beta"
        showFilters={false}
        showSortOptions={false}
      />
      <VariableGrid page={pageType} items={items} />
    </SelectionProvider>
  );
};

export const Repositories = React.memo(BetaRepositoriesPage);
