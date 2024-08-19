import {
  Collection,
  SandboxFragmentDashboardFragment,
  SidebarCollectionDashboardFragment,
  ProjectFragment as Repository,
} from 'app/graphql/types';
import { useAppState, useActions } from 'app/overmind';
import Fuse from 'fuse.js';
import React, { useEffect } from 'react';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';

const useSearchedSandboxes = (query: string) => {
  const state = useAppState();
  const actions = useActions();
  const [foundResults, setFoundResults] = React.useState<
    | (SandboxFragmentDashboardFragment | SidebarCollectionDashboardFragment)[]
    | null
  >(null);
  const [searchIndex, setSearchindex] = React.useState<Fuse<
    SandboxFragmentDashboardFragment | SidebarCollectionDashboardFragment,
    unknown
  > | null>(null);

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.SEARCH);
  }, [actions.dashboard, state.activeTeam]);

  useEffect(
    () => {
      setSearchindex(calculateSearchIndex(state.dashboard, state.activeTeam));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      state.dashboard.sandboxes.SEARCH,
      state.dashboard.repositoriesByTeamId,
      state.activeTeam,
    ]
  );

  useEffect(() => {
    if (searchIndex) {
      setFoundResults(searchIndex.search(query));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, searchIndex]);

  return foundResults;
};

const calculateSearchIndex = (dashboard: any, activeTeam: string) => {
  const sandboxes = dashboard.sandboxes.SEARCH;
  if (sandboxes == null) {
    return null;
  }
  const folders: Collection[] = (dashboard.allCollections || [])
    .map(collection => ({
      ...collection,
      title: collection.name,
    }))
    .filter(f => f.title);

  const teamRepos = dashboard.repositoriesByTeamId[activeTeam] ?? [];
  const repositories = teamRepos.map((repo: Repository) => {
    return {
      title: repo.repository.name,
      /**
       * Due to the lack of description we add the owner so we can at least
       * include that in the search query.
       */
      description: repo.repository.owner,
      ...repo,
    };
  });

  return new Fuse([...sandboxes, ...folders, ...(repositories || [])], {
    threshold: 0.1,
    distance: 1000,
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'description', weight: 0.2 },
      { name: 'alias', weight: 0.2 },
      { name: 'source.template', weight: 0.1 },
      { name: 'id', weight: 0.1 },
    ],
  });
};

export const useGetItems = ({
  query,
  username,
  getFilteredSandboxes,
}: {
  query: string;
  username: string;
  getFilteredSandboxes: (
    sandboxes: (
      | SandboxFragmentDashboardFragment
      | SidebarCollectionDashboardFragment
    )[]
  ) => SandboxFragmentDashboardFragment[];
}) => {
  const foundResults: Array<
    SandboxFragmentDashboardFragment | SidebarCollectionDashboardFragment
  > = useSearchedSandboxes(query) || [];

  // @ts-ignore
  const sandboxesInSearch = foundResults.filter(s => !s.path);
  // @ts-ignore
  const foldersInSearch = foundResults.filter(s => s.path);

  const filteredSandboxes: SandboxFragmentDashboardFragment[] = getFilteredSandboxes(
    sandboxesInSearch
  );

  const orderedSandboxes = [...foldersInSearch, ...filteredSandboxes].filter(
    item => {
      // @ts-ignore
      if (item.path || item.repository) {
        return true;
      }

      const sandbox = item as SandboxFragmentDashboardFragment;

      // Remove draft sandboxes from other authors
      return sandbox.draft && sandbox.author.username === username;
    }
  );

  // @ts-ignore
  const items: DashboardGridItem[] =
    foundResults != null
      ? orderedSandboxes.map(found => {
          // @ts-ignore
          if (found.path) {
            return {
              type: 'folder',
              ...found,
            };
          }

          // @ts-ignore
          if (found.repository) {
            return {
              type: 'repository',
              repository: {
                // @ts-ignore
                branchCount: found.branchCount,
                // @ts-ignore
                repository: found.repository,
              },
            };
          }

          return {
            type: 'sandbox',
            sandbox: found,
          };
        })
      : [{ type: 'skeleton-row' }];

  return [items, sandboxesInSearch];
};
