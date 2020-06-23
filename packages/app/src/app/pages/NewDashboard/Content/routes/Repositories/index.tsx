import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Element } from '@codesandbox/components';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { VariableGrid } from 'app/pages/NewDashboard/Components/VariableGrid';
import { DashboardGridItem } from 'app/pages/NewDashboard/types';
import { getPossibleTemplates } from '../../utils';
import { useFilteredItems } from './useFilteredItems';

export const RepositoriesPage = () => {
  const params = useParams<{ path: string }>();
  // const items = useFilteredItems(params);
  const param = params.path || '';
  const {
    actions,
    state: {
      dashboard: { sandboxes, activeTeam },
    },
  } = useOvermind();

  React.useEffect(() => {
    const lol = !param || param === '/' ? null : param;
    actions.dashboard.getReposByPath(lol);
  }, [param, actions.dashboard, activeTeam]);

  const activeSandboxes =
    (sandboxes.REPOS && Object.values(sandboxes.REPOS)) || [];

  const itemsToShow = () => {
    if (!sandboxes.REPOS)
      return [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
    if (!param || param === '/') {
      return sandboxes.REPOS
        ? [
            ...activeSandboxes.map(folder => ({
              type: 'repo' as 'repo',
              ...folder,
            })),
          ]
        : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
    } else {
      return sandboxes.REPOS[param] && sandboxes.REPOS[param].sandboxes
        ? [
            ...sandboxes.REPOS[param].sandboxes.map(sandbox => ({
              type: 'sandbox' as 'sandbox',
              sandbox,
            })),
          ]
        : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
    }
  };
  return (
    <Element
      css={`
        box-sizing: border-box;
        padding-top: 40px;
      `}
    >
      <Helmet>
        <title>{param || 'Dashboard'} - CodeSandbox</title>
      </Helmet>
      <Header
        repos
        path={param}
        templates={getPossibleTemplates(activeSandboxes)}
        showViewOptions
        showFilters={Boolean(param)}
        showSortOptions={Boolean(param)}
      />
      <VariableGrid items={itemsToShow()} />
    </Element>
  );
};

export const Repositories = React.memo(RepositoriesPage);
