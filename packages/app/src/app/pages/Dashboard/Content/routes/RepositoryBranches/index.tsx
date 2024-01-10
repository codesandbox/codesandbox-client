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
import { BranchFragment } from 'app/graphql/types';
import { InstallGHAppStripe } from 'app/pages/Dashboard/Components/shared/InstallGHAppStripe';

type MappedBranches = {
  defaultBranch: BranchFragment | null;
  accessedBranches: BranchFragment[];
  unaccessedBranches: BranchFragment[];
};

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
  const restricted = isFree && isPrivate;

  const pageType: PageTypes = 'repository-branches';

  const getItemsToShow = (): DashboardGridItem[] => {
    if (repositoryProject === undefined) {
      return [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];
    }

    // Use a reducer to create an object to store the following values:
    // default branch, accessed branches and unaccessed branches. This
    // way, we get the data we need in a single loop.
    const branches = repositoryProject.branches.reduce(
      (acc, branch) => {
        if (branch.name === repositoryProject.repository.defaultBranch) {
          acc.defaultBranch = branch;
        } else if (branch.lastAccessedAt) {
          acc.accessedBranches.push(branch);
        } else {
          acc.unaccessedBranches.push(branch);
        }
        return acc;
      },
      {
        defaultBranch: null,
        accessedBranches: [],
        unaccessedBranches: [],
      } as MappedBranches
    );

    const orderedBranches = [
      ...branches.accessedBranches.sort(sortByLastAccessed),
      ...branches.unaccessedBranches,
    ];

    if (branches.defaultBranch) {
      orderedBranches.unshift(branches.defaultBranch);
    }

    const branchItems: DashboardGridItem[] = orderedBranches.map(branch => ({
      type: 'branch',
      branch,
    }));

    if (viewMode === 'grid') {
      branchItems.unshift({
        type: 'new-branch',
        workspaceId: repositoryProject?.team?.id,
        repo: { owner, name },
        disabled: isFree && repositoryProject.repository.private,
        onClick: () => {
          actions.dashboard.createDraftBranch({
            owner,
            name,
            teamId: repositoryProject?.team?.id,
          });
        },
      });
    }

    return branchItems;
  };

  const itemsToShow = getItemsToShow();
  const ownerNamePath = `${owner}/${name}`;

  const renderMessageStripe = () => {
    if (restricted) {
      return <PrivateRepoFreeTeam />;
    }

    if (repositoryProject?.appInstalled === false) {
      return (
        <InstallGHAppStripe
          onCloseWindow={() => {
            // Refetch repo data to get rid of the banner until we implement the GH app subscription
            actions.dashboard.getRepositoryWithBranches({
              activeTeam,
              owner,
              name,
            });
          }}
        />
      );
    }
  };

  const messageStripe = renderMessageStripe();

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
        nestedPageType={pageType}
        selectedRepo={{
          owner: repositoryProject?.repository.owner,
          name: repositoryProject?.repository.name,
          assignedTeamId: repositoryProject?.team?.id,
        }}
        readOnly={restricted}
      />

      {messageStripe && (
        <Element paddingX={4} paddingBottom={4}>
          {messageStripe}
        </Element>
      )}

      <VariableGrid page={pageType} items={itemsToShow} />
    </SelectionProvider>
  );
};
