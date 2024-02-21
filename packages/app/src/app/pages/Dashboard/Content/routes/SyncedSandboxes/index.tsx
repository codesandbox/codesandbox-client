import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { useFilteredItems } from './useFilteredItems';

export const SyncedSandboxesPage = () => {
  const params = useParams<{ path: string }>();
  const items = useFilteredItems(params);
  const param = params.path || '';
  const home = !param || param === '/';
  const actions = useActions();
  const {
    activeTeam,
    dashboard: { sandboxes },
  } = useAppState();

  React.useEffect(() => {
    const path = home ? null : param;
    actions.dashboard.getReposByPath(path);
  }, [param, actions.dashboard, activeTeam, home]);

  const getItemsToShow = (): DashboardGridItem[] => {
    if (sandboxes.REPOS === null) {
      return [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
    }

    if (home) {
      return items;
    }

    if (sandboxes.REPOS[param] && sandboxes.REPOS[param].sandboxes) {
      return items;
    }

    return [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
  };

  const itemsToShow = getItemsToShow();

  const pageType: PageTypes = 'synced-sandboxes';

  return (
    <SelectionProvider
      page={pageType}
      activeTeamId={activeTeam}
      items={itemsToShow}
    >
      <Helmet>
        <title>{param || 'Synced sandboxes'} - CodeSandbox</title>
      </Helmet>
      <Header
        activeTeam={activeTeam}
        path={param}
        showViewOptions
        showSortOptions={Boolean(param)}
        nestedPageType={pageType}
      />
      <VariableGrid page={pageType} items={itemsToShow} />
    </SelectionProvider>
  );
};

export const SyncedSandboxes = React.memo(SyncedSandboxesPage);
