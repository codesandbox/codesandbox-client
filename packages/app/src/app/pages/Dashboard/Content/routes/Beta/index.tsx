import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { useFilteredItems } from './useFilteredItems';

export const BetaRepositoriesPage = () => {
  const params = useParams<{ path: string }>();
  const items = useFilteredItems(params);

  const actions = useActions();
  const {
    activeTeam,
    dashboard: { sandboxes, viewMode },
  } = useAppState();

  React.useEffect(() => {
    actions.dashboard.getReposByPath(null);
  }, [actions.dashboard]);

  const itemsToShow = (): DashboardGridItem[] => {
    if (sandboxes.REPOS === null) {
      return [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
    }

    return viewMode === 'grid' && items.length
      ? [{ type: 'new-repo' }, ...items]
      : items;
  };

  const pageType: PageTypes = 'repos';

  return (
    <SelectionProvider
      page={pageType}
      activeTeamId={activeTeam}
      items={itemsToShow()}
    >
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
      <VariableGrid page={pageType} items={itemsToShow()} />
    </SelectionProvider>
  );
};

export const Repositories = React.memo(BetaRepositoriesPage);
