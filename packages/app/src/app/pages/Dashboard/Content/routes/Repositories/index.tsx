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
  const path = params.path ?? '';
  const actions = useActions();
  const {
    activeTeam,
    dashboard: { repositories },
  } = useAppState();
  const pathRef = React.useRef<string>(null);

  React.useEffect(() => {
    // If no repositories were fetched yet and the user tries
    // to directly access a repository, we should fetch said
    // repository only.
    if (repositories === null) {
      if (path) {
        const [, owner, name] = path.split('/');
        actions.dashboard.getRepositoryByDetails({ owner, name });
      } else {
        actions.dashboard.getRepositoriesByTeam();
      }
    }

    // If the current view is the list of the repositories
    // and the previous view was a repo and only that repo
    // was fetched, get all repositories of that team.
    if (
      path === '' &&
      pathRef.current?.startsWith('github') &&
      repositories.length === 1
    ) {
      actions.dashboard.getRepositoriesByTeam();
    }

    pathRef.current = path;
  }, [path]);

  const pageType: PageTypes = 'repositories';

  const itemsToShow = (): DashboardGridItem[] => {
    if (repositories === null) {
      return [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
    }

    if (path) {
      const [, owner, name] = path.split('/');
      const currentRepository = repositories.find(
        r => r.repository.owner === owner && r.repository.name === name
      );

      if (!currentRepository) {
        return [];
      }

      return currentRepository.branches.map(branch => ({
        type: 'branch',
        branch,
      }));
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
        <title>{path || 'Dashboard'} - CodeSandbox</title>
      </Helmet>
      <Header
        activeTeam={activeTeam}
        path={path}
        showViewOptions
        nestedPageType={pageType}
      />
      <VariableGrid page={pageType} items={itemsToShow()} />
    </SelectionProvider>
  );
};

export const Repositories = React.memo(RepositoriesPage);
