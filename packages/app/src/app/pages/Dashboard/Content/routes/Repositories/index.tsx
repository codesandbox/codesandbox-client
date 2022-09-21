import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';

export const RepositoriesPage = () => {
  const params = useParams<{ path: string }>();
  const param = params.path || '';
  const actions = useActions();
  const {
    activeTeam,
    dashboard: { v2Repositories },
  } = useAppState();

  React.useEffect(() => {
    actions.dashboard.getV2Repositories();
  }, [activeTeam, actions.dashboard]);

  const pageType: PageTypes = 'repositories';

  const itemsToShow = (): DashboardGridItem[] => {
    if (v2Repositories === null) {
      return [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
    }

    return v2Repositories;
  };

  return (
    <SelectionProvider
      page={pageType}
      activeTeamId={activeTeam}
      items={itemsToShow()}
    >
      <Helmet>
        <title>{param || 'Dashboard'} - CodeSandbox</title>
      </Helmet>
      <Header
        activeTeam={activeTeam}
        repos="repositories"
        path={param}
        showViewOptions
        showFilters={Boolean(param)}
        showSortOptions={Boolean(param)}
      />
      <VariableGrid page={pageType} items={itemsToShow()} />
    </SelectionProvider>
  );
};

export const Repositories = React.memo(RepositoriesPage);
