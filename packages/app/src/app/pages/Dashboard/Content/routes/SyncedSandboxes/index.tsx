import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import {
  DashboardGridItem,
  DashboardRepoSandbox,
  PageTypes,
} from 'app/pages/Dashboard/types';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { getPossibleTemplates } from '../../utils';
import { useFilteredItems } from './useFilteredItems';

export const SyncedSandboxesPage = () => {
  const params = useParams<{ path: string }>();
  const items = useFilteredItems(params);
  const param = params.path || '';
  const home = !param || param === '/';
  const actions = useActions();
  const {
    activeTeam,
    dashboard: { sandboxes, viewMode },
  } = useAppState();

  React.useEffect(() => {
    const path = home ? null : param;
    actions.dashboard.getReposByPath(path);
  }, [param, actions.dashboard, activeTeam, home]);

  const activeSandboxes =
    (sandboxes.REPOS && Object.values(sandboxes.REPOS)) || [];

  const itemsToShow = (): DashboardGridItem[] => {
    if (sandboxes.REPOS === null) {
      return [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
    }

    if (home) {
      return viewMode === 'grid' && items.length
        ? [{ type: 'new-repo' }, ...items]
        : items;
    }

    if (sandboxes.REPOS[param] && sandboxes.REPOS[param].sandboxes) {
      return [
        {
          type: 'new-master-branch',
          repo: {
            owner: sandboxes.REPOS[param].owner,
            name: sandboxes.REPOS[param].name,
            branch: sandboxes.REPOS[param].branch,
          },
        },
        ...items,
      ];
    }

    return [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
  };

  const possibleTemplates = itemsToShow()
    .filter((s: DashboardRepoSandbox) => s.sandbox)
    .map((s: DashboardRepoSandbox) => s.sandbox);

  const templates =
    activeSandboxes.length && param && items[0] && items[0].type === 'sandbox'
      ? getPossibleTemplates(possibleTemplates)
      : [];

  const pageType: PageTypes = 'synced-sandboxes';

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
        path={param}
        templates={templates}
        showViewOptions
        showFilters={Boolean(param)}
        showSortOptions={Boolean(param)}
        nestedPageType={pageType}
      />
      <VariableGrid page={pageType} items={itemsToShow()} />
    </SelectionProvider>
  );
};

export const SyncedSandboxes = React.memo(SyncedSandboxesPage);
