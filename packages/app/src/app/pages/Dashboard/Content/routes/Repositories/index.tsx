import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { Element } from '@codesandbox/components';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { MaxReposFreeTeam, PrivateRepoFreeTeam } from './stripes';
import { EmptyRepositories } from './EmptyRepositories';

export const RepositoriesPage = () => {
  const params = useParams<{ path: string }>();
  const path = params.path ?? '';
  const actions = useActions();
  const {
    activeTeam,
    dashboard: { repositories, viewMode },
  } = useAppState();
  const pathRef = React.useRef<string>(null);

  const teamRepos = repositories?.[activeTeam] ?? null;

  React.useEffect(() => {
    // If no repositories were fetched yet and the user tries
    // to directly access a repository, we should fetch said
    // repository only.
    if (!teamRepos) {
      if (path) {
        const [, owner, name] = path.split('/');
        actions.dashboard.getRepositoryByDetails({ owner, name });
      } else {
        actions.dashboard.getRepositoriesByTeam({ teamId: activeTeam });
      }
    }

    // If the current view is the list of the repositories
    // and the previous view was a repo and only that repo
    // was fetched, get all repositories of that team.
    if (
      path === '' &&
      pathRef.current?.startsWith('github') &&
      teamRepos.length === 1
    ) {
      actions.dashboard.getRepositoriesByTeam({ teamId: activeTeam });
    }

    pathRef.current = path;
  }, [path, activeTeam]);

  const { isFree } = useWorkspaceSubscription();
  const {
    hasMaxPublicRepositories,
    hasMaxPrivateRepositories,
  } = useWorkspaceLimits();

  const pageType: PageTypes = 'repositories';
  let selectedRepo:
    | { owner: string; name: string; private: boolean }
    | undefined;

  const getItemsToShow = (): DashboardGridItem[] => {
    if (teamRepos === null) {
      return [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
    }

    if (path) {
      const [, owner, name] = path.split('/');
      const currentRepository = teamRepos.find(
        r => r.repository.owner === owner && r.repository.name === name
      );

      if (!currentRepository) {
        return [];
      }

      selectedRepo = {
        owner,
        name,
        private: currentRepository.repository.private,
      };

      const branchItems: DashboardGridItem[] = currentRepository.branches.map(
        branch => ({
          type: 'branch',
          branch,
        })
      );

      if (viewMode === 'grid') {
        branchItems.unshift({
          type: 'new-branch',
          repo: { owner, name },
          disabled: isFree && selectedRepo.private,
        });
      }

      return branchItems;
    }

    const repoItems: DashboardGridItem[] =
      teamRepos?.map(repository => ({
        type: 'repository' as const,
        repository,
      })) ?? [];

    if (viewMode === 'grid' && repoItems.length > 0) {
      repoItems.unshift({
        type: 'import-repository',
        disabled: hasMaxPublicRepositories,
      });
    }

    return repoItems;
  };

  const itemsToShow = getItemsToShow();
  const isReadOnlyRepo = isFree && selectedRepo?.private;
  const isEmpty = itemsToShow.length === 0;

  return (
    <SelectionProvider
      page={pageType}
      activeTeamId={activeTeam}
      items={itemsToShow}
    >
      <Helmet>
        <title>{path || 'Repositories'} - CodeSandbox</title>
      </Helmet>
      <Header
        activeTeam={activeTeam}
        path={path}
        showViewOptions={!isEmpty}
        showBetaBadge
        nestedPageType={pageType}
        selectedRepo={selectedRepo}
        readOnly={isReadOnlyRepo}
      />

      {isReadOnlyRepo ? (
        <Element paddingX={4} paddingY={2}>
          <PrivateRepoFreeTeam />
        </Element>
      ) : null}

      {!selectedRepo &&
        (hasMaxPublicRepositories || hasMaxPrivateRepositories) ? (
        <Element paddingX={4} paddingY={2}>
          <MaxReposFreeTeam />
        </Element>
      ) : null}

      {isEmpty ? (
        <EmptyRepositories />
      ) : (
        <VariableGrid
          page={pageType}
          items={itemsToShow}
          customGridElementHeight={
            path /* selectedRepo is undefined when the page is loading, so we ned to check agains the path. */
              ? undefined
              : 154 /* 154 just for repo cards */
          }
        />
      )}
    </SelectionProvider>
  );
};

export const Repositories = React.memo(RepositoriesPage);
