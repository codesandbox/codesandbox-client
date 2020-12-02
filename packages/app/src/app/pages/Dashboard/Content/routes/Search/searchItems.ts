import {
  Collection,
  SandboxFragmentDashboardFragment,
  SidebarCollectionDashboardFragment,
} from 'app/graphql/types';
import { useOvermind } from 'app/overmind';
import Fuse from 'fuse.js';
import React, { useEffect } from 'react';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';

const useSearchedSandboxes = (query: string) => {
  const { actions, state } = useOvermind();
  const [foundResults, setFoundResults] = React.useState<
    | (SandboxFragmentDashboardFragment | SidebarCollectionDashboardFragment)[]
    | null
  >(null);

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.SEARCH);
  }, [actions.dashboard, state.activeTeam]);

  useEffect(() => {
    const index = searchIndex(state.dashboard);
    if (index) {
      setFoundResults(index.search(query));
    }
  }, [query, searchIndex]);

  return foundResults;
};

export const searchIndex = (dashboard: any) => {
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

  return new Fuse([...sandboxes, ...folders], {
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

export const useGetItems = ({ query, getFilteredSandboxes }) => {
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
  const orderedSandboxes = [...foldersInSearch, ...filteredSandboxes];
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

          return {
            type: 'sandbox',
            sandbox: found,
          };
        })
      : [{ type: 'skeleton-row' }];

  return [items, sandboxesInSearch];
};
