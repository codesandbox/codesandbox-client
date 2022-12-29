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
import { PrivateRepoFreeTeam } from 'app/pages/Dashboard/Components/Repository/stripes';
import {
  getProjectUniqueKey,
  sortByLastAccessed,
} from 'app/overmind/namespaces/dashboard/utils';

export const RepositoryBranchesPage = () => {
  const params = useParams<{ path: string }>();
  const path = params.path || '';
  const [, owner, name] = path.split('/');
  const actions = useActions();
  const {
    activeTeam,
    dashboard: { repositoriesWithBranches, viewMode },
  } = useAppState();

  const key = getProjectUniqueKey({ teamId: activeTeam, owner, name });
  const repositoryProject = repositoriesWithBranches[key] || undefined;

  React.useEffect(() => {
    // If no repositories were fetched yet and the user tries
    // to directly access a repository, we should fetch said
    // repository only.
    if (!repositoryProject && activeTeam) {
      actions.dashboard.getRepositoryWithBranches({
        activeTeam,
        owner,
        name,
      });
    }
  }, [activeTeam]);

  const { isFree } = useWorkspaceSubscription();
  const isPrivate = repositoryProject?.repository.private;
  const isReadOnlyRepo = isFree && isPrivate;

  const pageType: PageTypes = 'repository-branches';

  const getItemsToShow = (): DashboardGridItem[] => {
    if (repositoryProject === undefined) {
      return [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
    }

    const accessedBranches = repositoryProject.branches.filter(
      b => b.lastAccessedAt
    );
    const unaccessedBranches = repositoryProject.branches.filter(
      b => !b.lastAccessedAt
    );
    const orderedBranches = [
      ...accessedBranches.sort(sortByLastAccessed),
      ...unaccessedBranches,
    ];

    const branchItems: DashboardGridItem[] = orderedBranches.map(branch => ({
      type: 'branch',
      branch,
    }));

    if (viewMode === 'grid') {
      branchItems.unshift({
        type: 'new-branch',
        repo: { owner, name },
        disabled: isFree && repositoryProject.repository.private,
      });
    }

    return branchItems;
  };

  const itemsToShow = getItemsToShow();
  const ownerNamePath = `${owner}/${name}`;

  return (
    <SelectionProvider
      page={pageType}
      activeTeamId={activeTeam}
      items={itemsToShow}
    >
      <Helmet>
        <title>{ownerNamePath || 'Repositories'} - CodeSandbox</title>
      </Helmet>
      <Header
        activeTeam={activeTeam}
        path={ownerNamePath}
        showViewOptions
        showBetaBadge
        nestedPageType={pageType}
        selectedRepo={{
          owner: repositoryProject?.repository.owner,
          name: repositoryProject?.repository.name,
        }}
        readOnly={isReadOnlyRepo}
      />

      {isReadOnlyRepo && (
        <Element paddingX={4} paddingY={2}>
          {isPrivate && <PrivateRepoFreeTeam />}
        </Element>
      )}

      <VariableGrid
        customGridElementHeight={154}
        page={pageType}
        items={itemsToShow}
      />
    </SelectionProvider>
  );
};
