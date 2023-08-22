import React from 'react';
import { Helmet } from 'react-helmet';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { Element } from '@codesandbox/components';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useGitHuPermissions } from 'app/hooks/useGitHubPermissions';
import { MaxReposFreeTeam } from 'app/pages/Dashboard/Components/Repository/stripes';
import { RestrictedPublicReposImport } from 'app/pages/Dashboard/Components/shared/RestrictedPublicReposImport';
import { InactiveTeamStripe } from 'app/pages/Dashboard/Components/shared/InactiveTeamStripe';
import { useDismissible } from 'app/hooks';
import { EmptyRepositories } from './EmptyRepositories';

export const RepositoriesPage = () => {
  const actions = useActions();
  const {
    activeTeam,
    dashboard: { repositoriesByTeamId, viewMode },
  } = useAppState();
  const [dismissedPermissionsBanner, dismissPermissionsBanner] = useDismissible(
    'DASHBOARD_REPOSITORIES_PERMISSIONS_BANNER'
  );

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

  const { isInactiveTeam } = useWorkspaceSubscription();
  const {
    hasMaxPublicRepositories,
    hasMaxPrivateRepositories,
  } = useWorkspaceLimits();

  const { restrictsPublicRepos } = useGitHuPermissions();

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
        onImportClicked: () => {
          actions.openCreateSandboxModal({ initialTab: 'import' });
        },
        disabled:
          hasMaxPublicRepositories ||
          hasMaxPrivateRepositories ||
          isInactiveTeam,
      });
    }

    return repoItems;
  };

  const itemsToShow = getItemsToShow();
  const isEmpty = itemsToShow.length === 0;

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
        showViewOptions={!isEmpty}
        showBetaBadge
        title="All repositories"
      />

      {hasMaxPublicRepositories || hasMaxPrivateRepositories ? (
        <Element paddingLeft={4} paddingRight={6} paddingY={4}>
          <MaxReposFreeTeam />
        </Element>
      ) : null}

      {isInactiveTeam ? (
        <InactiveTeamStripe>
          Re-activate your workspace to import new repositories.
        </InactiveTeamStripe>
      ) : null}

      {restrictsPublicRepos && !dismissedPermissionsBanner ? (
        <Element paddingLeft={4} paddingRight={6} paddingY={4}>
          <RestrictedPublicReposImport onDismiss={dismissPermissionsBanner} />
        </Element>
      ) : null}

      {isEmpty ? (
        <EmptyRepositories />
      ) : (
        <VariableGrid page={pageType} items={itemsToShow} />
      )}
    </SelectionProvider>
  );
};
