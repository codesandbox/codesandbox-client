import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { Notification } from 'app/pages/Dashboard/Components/Notification/Notification';
import { Text, Element } from '@codesandbox/components';
import { useSubscription } from 'app/hooks/useSubscription';
import { MaxPublicReposFreeTeam, PrivateRepoFreeTeam } from './stripes';

export const RepositoriesPage = () => {
  const params = useParams<{ path: string }>();
  const path = params.path ?? '';
  const actions = useActions();
  const {
    activeTeam,
    dashboard: { repositories, viewMode },
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

  const { hasActiveSubscription, hasMaxPublicRepositories } = useSubscription();

  const pageType: PageTypes = 'repositories';
  let selectedRepo:
    | { owner: string; name: string; private: boolean }
    | undefined;

  const getItemsToShow = (): DashboardGridItem[] => {
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
          disabled: !hasActiveSubscription && selectedRepo.private,
        });
      }

      return branchItems;
    }

    const repoItems: DashboardGridItem[] = repositories.map(repository => ({
      type: 'repository' as const,
      repository,
    }));

    if (viewMode === 'grid' && repoItems.length > 0) {
      repoItems.unshift({
        type: 'import-repository',
        disabled: !hasActiveSubscription && hasMaxPublicRepositories,
      });
    }

    return repoItems;
  };

  const itemsToShow = getItemsToShow();
  const readOnly =
    !hasActiveSubscription &&
    (selectedRepo?.private || hasMaxPublicRepositories);

  return (
    <SelectionProvider
      page={pageType}
      activeTeamId={activeTeam}
      items={itemsToShow}
    >
      <Helmet>
        <title>{path || 'Dashboard'} - CodeSandbox</title>
      </Helmet>
      <Header
        activeTeam={activeTeam}
        path={path}
        showViewOptions
        showBetaBadge
        nestedPageType={pageType}
        selectedRepo={selectedRepo}
        readOnly={readOnly}
      />

      {readOnly && (
        <Element paddingX={4} paddingY={2}>
          {selectedRepo?.private && <PrivateRepoFreeTeam />}
          {hasMaxPublicRepositories && !selectedRepo && (
            <MaxPublicReposFreeTeam />
          )}
        </Element>
      )}

      {itemsToShow.length === 0 ? (
        <Notification pageType={pageType}>
          <Text>
            CodeSandbox Projects is now Repositories: an improved git workflow
            powered by the cloud.
          </Text>
        </Notification>
      ) : (
        <Notification pageType={pageType}>
          <Text>
            Your CodeSandbox Projects repositories now live here. Repository
            sandboxes are now listed under{' '}
            <Text css={{ color: '#EBEBEB' }}>Synced sandboxes</Text>. You can
            find your contribution branches on{' '}
            <Text css={{ color: '#EBEBEB' }}>My contributions</Text> inside your
            personal team.
          </Text>
        </Notification>
      )}

      <VariableGrid page={pageType} items={itemsToShow} />
    </SelectionProvider>
  );
};

export const Repositories = React.memo(RepositoriesPage);
