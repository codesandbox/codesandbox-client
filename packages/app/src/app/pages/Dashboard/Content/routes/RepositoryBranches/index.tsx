import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';

export const RepositoryBranchesPage = () => {
  const params = useParams<{
    provider: 'github';
    owner: string;
    name: string;
  }>();
  const actions = useActions();
  const {
    activeTeam,
    dashboard: { repositories },
  } = useAppState();

  React.useEffect(() => {
    actions.dashboard.getRepositoriesByTeam();
  }, [activeTeam, actions.dashboard]);

  const pageType: PageTypes = 'repository-branches';

  const itemsToShow = (): DashboardGridItem[] => {
    if (repositories === null) {
      return [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
    }

    return repositories.map(repository => ({
      type: 'repository',
      repository,
    }));
  };

  return (
    <SelectionProvider
      page={pageType}
      activeTeamId={activeTeam}
      items={itemsToShow()}
    >
      <Helmet>
        <title>
          {params.owner}/{params.name} - CodeSandbox
        </title>
      </Helmet>
      <Header
        activeTeam={activeTeam}
        nestedPageType={pageType}
        path={`${params.owner}/${params.name}`}
        showViewOptions
      />
      foo.
      <VariableGrid page={pageType} items={[]} />
    </SelectionProvider>
  );
};

export const Repositories = React.memo(RepositoryBranchesPage);
