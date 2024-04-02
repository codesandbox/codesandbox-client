import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { Element } from '@codesandbox/components';
import {
  getProjectUniqueKey,
  sortByLastAccessed,
} from 'app/overmind/namespaces/dashboard/utils';
import { BranchWithPrFragment } from 'app/graphql/types';
import { InstallGHAppStripe } from 'app/pages/Dashboard/Components/shared/InstallGHAppStripe';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';

type MappedBranches = {
  defaultBranch: BranchWithPrFragment | null;
  activePRs: BranchWithPrFragment[];
  myBranches: BranchWithPrFragment[];
  otherRemoteBranches: BranchWithPrFragment[];
};

export const RepositoryBranchesPage = () => {
  const { isFrozen } = useWorkspaceLimits();
  const params = useParams<{ path: string }>();
  const path = params.path || '';
  const [, owner, name] = path.split('/');
  const actions = useActions();
  const {
    activeTeam,
    dashboard: { repositoriesWithBranches },
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
  }, [activeTeam, owner, name]);

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
        } else if (branch.pullRequests.length > 0) {
          // First we show the branches that have PRs attached to them.
          acc.activePRs.push(branch);
        } else if (branch.lastAccessedAt) {
          // lastAccessedAt is only set when the current user visits a branch.
          acc.myBranches.push(branch);
        } else if (branch.upstream) {
          // only show other branches that have been pushed to GH, not all draft branches.
          acc.otherRemoteBranches.push(branch);
        }
        return acc;
      },
      {
        defaultBranch: null,
        activePRs: [],
        myBranches: [],
        otherRemoteBranches: [],
      } as MappedBranches
    );

    const orderedBranches = [
      ...branches.activePRs.sort(
        (a, b) => b.pullRequests[0]?.number - a.pullRequests[0]?.number
      ),
      ...branches.myBranches.sort(sortByLastAccessed),
      ...branches.otherRemoteBranches,
    ];

    if (branches.defaultBranch) {
      orderedBranches.unshift(branches.defaultBranch);
    }

    const branchItems: DashboardGridItem[] = orderedBranches.map(branch => ({
      type: 'branch',
      branch,
    }));

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
        path={name}
        showViewOptions={false}
        nestedPageType={pageType}
        selectedRepo={{
          owner: repositoryProject?.repository.owner,
          name: repositoryProject?.repository.name,
          assignedTeamId: repositoryProject?.team?.id,
        }}
        readOnly={isFrozen}
      />

      {repositoryProject?.appInstalled === false && (
        <Element paddingX={4} paddingBottom={4}>
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
        </Element>
      )}

      <VariableGrid page={pageType} items={itemsToShow} />
    </SelectionProvider>
  );
};
