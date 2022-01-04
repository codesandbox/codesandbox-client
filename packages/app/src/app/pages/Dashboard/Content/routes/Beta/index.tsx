import React from 'react';
import { Helmet } from 'react-helmet';
import { sortBy } from 'lodash-es';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
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
    ? ([
        { type: 'beta-new-repo' },
        ...sortBy(
          sandboxes.BETA.map(sandbox => ({
            type: 'beta-repo' as const,
            sandbox,
          })),
          s => {
            const repoName = `${s.sandbox.gitv2.owner}/${s.sandbox.gitv2.repo}`.toLocaleLowerCase();
            return repoName;
          }
        ),
      ].filter(Boolean) as DashboardGridItem[])
    : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];

  const pageType: PageTypes = 'repos';

  return (
    <SelectionProvider page={pageType} activeTeamId={activeTeam} items={items}>
      <Helmet>
        <title>Beta Repositories - CodeSandbox</title>
      </Helmet>
      <Header
        activeTeam={activeTeam}
        repos
        path="Beta"
        showViewOptions={false}
        showFilters={false}
        showSortOptions={false}
        actions={[
          {
            title: '+ Import Repository',
            action: () => {
              actions.openImportBetaSandboxModal();
            },
          },
        ]}
      />
      <VariableGrid viewMode="list" page={pageType} items={items} />
    </SelectionProvider>
  );
};

export const Repositories = React.memo(BetaRepositoriesPage);
