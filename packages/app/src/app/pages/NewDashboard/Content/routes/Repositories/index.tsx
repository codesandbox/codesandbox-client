import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { VariableGrid } from 'app/pages/NewDashboard/Components/VariableGrid';
import {
  DashboardRepo,
  DashboardGridItem,
  DashboardSandbox,
} from 'app/pages/NewDashboard/types';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { getPossibleTemplates } from '../../utils';
import { useFilteredItems } from './useFilteredItems';

export const RepositoriesPage = () => {
  const [allItems, setAllItems] = useState<DashboardGridItem[]>([]);
  const params = useParams<{ path: string }>();
  const items = useFilteredItems(params);
  const param = params.path || '';
  const home = !param || param === '/';
  const {
    actions,
    state: {
      activeTeam,
      dashboard: { sandboxes },
    },
  } = useOvermind();

  React.useEffect(() => {
    const p = home ? null : param;
    actions.dashboard.getReposByPath(p);
  }, [param, actions.dashboard, activeTeam, sandboxes.REPOS, home]);

  const activeSandboxes =
    (sandboxes.REPOS && Object.values(sandboxes.REPOS)) || [];

  const itemsToShow = ():
    | DashboardGridItem[]
    | { sandbox: DashboardSandbox; type: string }[] => {
    if (!sandboxes.REPOS) {
      return [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
    }
    if (home) return items;

    return sandboxes.REPOS[param] && sandboxes.REPOS[param].sandboxes
      ? [...items]
      : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
  };

  useEffect(() => {
    setAllItems(itemsToShow());
  }, [items, itemsToShow]);

  const templates =
    activeSandboxes.length && param && items[0] && items[0].type === 'sandbox'
      ? getPossibleTemplates(
          itemsToShow().map(
            (s: { sandbox: DashboardSandbox; type: string }) => s.sandbox
          )
        )
      : [];

  return (
    <SelectionProvider items={allItems} noDrag>
      <Helmet>
        <title>{param || 'Dashboard'} - CodeSandbox</title>
      </Helmet>
      <Header
        repos
        path={param}
        templates={templates}
        showViewOptions
        showFilters={Boolean(param)}
        showSortOptions={Boolean(param)}
      />
      <VariableGrid items={allItems} />
    </SelectionProvider>
  );
};

export const Repositories = React.memo(RepositoriesPage);
