import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { VariableGrid } from 'app/pages/NewDashboard/Components/VariableGrid';
import {
  DashboardGridItem,
  DashboardSandbox,
} from 'app/pages/NewDashboard/types';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { getPossibleTemplates } from '../../utils';
import { useFilteredItems } from './useFilteredItems';

export const RepositoriesPage = () => {
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
  }, [param, actions.dashboard, activeTeam, home]);

  const activeSandboxes =
    (sandboxes.REPOS && Object.values(sandboxes.REPOS)) || [];

  const itemsToShow = ():
    | DashboardGridItem[]
    | { sandbox: DashboardSandbox; type: string }[] => {
    if (!sandboxes.REPOS) {
      return [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
    }
    if (home) return [{ type: 'new-repo' }, ...items];

    return sandboxes.REPOS[param] && sandboxes.REPOS[param].sandboxes
      ? [
          {
            type: 'new-master-branch',
            repo: {
              owner: sandboxes.REPOS[param].owner,
              name: sandboxes.REPOS[param].name,
              branch: sandboxes.REPOS[param].branch,
            },
          },
          ...items,
        ]
      : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
  };

  const templates =
    activeSandboxes.length && param && items[0] && items[0].type === 'sandbox'
      ? getPossibleTemplates(
          itemsToShow()
            .filter(s => s.sandbox)
            .map((s: { sandbox: DashboardSandbox; type: string }) => s.sandbox)
        )
      : [];

  return (
    <SelectionProvider items={itemsToShow()} noDrag>
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
      <VariableGrid items={itemsToShow()} />
    </SelectionProvider>
  );
};

export const Repositories = React.memo(RepositoriesPage);
