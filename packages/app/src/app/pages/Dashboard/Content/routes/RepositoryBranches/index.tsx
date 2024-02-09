import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { Element, Text } from '@codesandbox/components';
import {
  getProjectUniqueKey,
  sortByLastAccessed,
} from 'app/overmind/namespaces/dashboard/utils';
import { BranchFragment } from 'app/graphql/types';
import { InstallGHAppStripe } from 'app/pages/Dashboard/Components/shared/InstallGHAppStripe';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';

type MappedBranches = {
  defaultBranch: BranchFragment | null;
  activePRs: BranchFragment[];
  accessedBranches: BranchFragment[];
  unaccessedBranches: BranchFragment[];
};

export const RepositoryBranchesPage = () => {
  const { isFrozen } = useWorkspaceLimits();
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

  const pageType: PageTypes = 'repository-branches';

  const getItemsToShow = (): {
    activePRItems?: DashboardGridItem[];
    branchItems: DashboardGridItem[];
  } => {
    if (repositoryProject === undefined) {
      return {
        activePRItems: [],
        branchItems: [{ type: 'skeleton-row' }, { type: 'skeleton-row' }],
      };
    }

    // Use a reducer to create an object to store the following values:
    // default branch, accessed branches and unaccessed branches. This
    // way, we get the data we need in a single loop.
    const branches = repositoryProject.branches.reduce(
      (acc, branch) => {
        if (branch.name === repositoryProject.repository.defaultBranch) {
          acc.defaultBranch = branch;
        } else if (branch.pullRequests.length > 0) {
          acc.activePRs.push(branch);
        } else if (branch.lastAccessedAt) {
          acc.accessedBranches.push(branch);
        } else {
          acc.unaccessedBranches.push(branch);
        }
        return acc;
      },
      {
        defaultBranch: null,
        activePRs: [],
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

    const activePRItems: DashboardGridItem[] = branches.activePRs.map(
      branch => ({
        type: 'branch',
        branch,
      })
    );

    const branchItems: DashboardGridItem[] = orderedBranches.map(branch => ({
      type: 'branch',
      branch,
    }));

    if (viewMode === 'grid') {
      branchItems.unshift({
        type: 'new-branch',
        workspaceId: repositoryProject?.team?.id,
        repo: { owner, name },
        disabled: isFrozen,
        onClick: () => {
          actions.dashboard.createDraftBranch({
            owner,
            name,
            teamId: repositoryProject?.team?.id,
          });
        },
      });
    }

    return {
      activePRItems,
      branchItems,
    };
  };

  const { branchItems, activePRItems } = getItemsToShow();
  const ownerNamePath = `${owner}/${name}`;

  return (
    <SelectionProvider page={pageType} activeTeamId={activeTeam} items={[]}>
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

      {activePRItems.length > 0 && (
        <>
          <Text size={16} css={{ padding: '16px' }}>
            Open PRs
          </Text>
          <VariableGrid page={pageType} items={activePRItems} />
        </>
      )}

      {branchItems.length > 0 && (
        <>
          <Text size={16} css={{ padding: '16px' }}>
            Other branches
          </Text>
          <VariableGrid page={pageType} items={branchItems} />
        </>
      )}
    </SelectionProvider>
  );
};
