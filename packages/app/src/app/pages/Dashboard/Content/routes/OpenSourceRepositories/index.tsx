import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';

export const OpenSourceRepositoriesPage = () => {
  const params = useParams<{ path: string }>();
  const param = params.path || '';
  const home = !param || param === '/';
  const actions = useActions();
  const { activeTeam } = useAppState();

  React.useEffect(() => {
    const p = home ? null : param;
    actions.dashboard.getReposByPath(p);
  }, [param, actions.dashboard, activeTeam, home]);

  const pageType: PageTypes = 'open-source-repos';

  const itemsToShow = (): DashboardGridItem[] => [];

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
        repos="open-source"
        path={param}
        showViewOptions
        showFilters={Boolean(param)}
        showSortOptions={Boolean(param)}
      />
      <VariableGrid page={pageType} items={itemsToShow()} />
    </SelectionProvider>
  );
};

export const OpenSourceRepositories = React.memo(OpenSourceRepositoriesPage);
