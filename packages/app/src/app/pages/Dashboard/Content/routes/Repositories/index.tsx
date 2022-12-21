import React from 'react';
import { Helmet } from 'react-helmet';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { Element } from '@codesandbox/components';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { MaxReposFreeTeam } from 'app/pages/Dashboard/Components/Repository/stripes';

export const RepositoriesPage = () => {
  const actions = useActions();
  const {
    activeTeam,
    dashboard: { repositoriesByTeamId, viewMode },
  } = useAppState();

  const teamRepos = repositoriesByTeamId[activeTeam] || undefined;

  React.useEffect(() => {
    // If no repositories were fetched yet for the teamId
    // trigger the call to get the server cached data for rapid loading
    // If data already exists on the client, call the backend
    // to sync the data with GitHub, as this is not perceived as slow
    actions.dashboard.getRepositoriesByTeam({
      teamId: activeTeam,
      fetchCachedDataFirst: teamRepos === undefined,
    });
  }, [activeTeam]);

  const {
    hasMaxPublicRepositories,
    hasMaxPrivateRepositories,
  } = useWorkspaceLimits();

  const pageType: PageTypes = 'repositories';

  const getItemsToShow = (): DashboardGridItem[] => {
    if (teamRepos === undefined) {
      return [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
    }

    const repoItems: DashboardGridItem[] = teamRepos.map(repository => ({
      type: 'repository' as const,
      repository,
    }));

    if (viewMode === 'grid' && repoItems.length > 0) {
      repoItems.unshift({
        type: 'import-repository',
        disabled: hasMaxPublicRepositories || hasMaxPrivateRepositories,
      });
    }

    return repoItems;
  };

  const itemsToShow = getItemsToShow();

  return (
    <SelectionProvider
      page={pageType}
      activeTeamId={activeTeam}
      items={itemsToShow}
    >
      <Helmet>
        <title>Repositories - CodeSandbox</title>
      </Helmet>
      <Header
        activeTeam={activeTeam}
        showViewOptions
        showBetaBadge
        title="All repositories"
      />

      {hasMaxPublicRepositories || hasMaxPrivateRepositories ? (
        <Element paddingX={4} paddingY={2}>
          <MaxReposFreeTeam />
        </Element>
      ) : null}

      <VariableGrid
        page={pageType}
        items={itemsToShow}
        customGridElementHeight={154}
      />
    </SelectionProvider>
  );
};
