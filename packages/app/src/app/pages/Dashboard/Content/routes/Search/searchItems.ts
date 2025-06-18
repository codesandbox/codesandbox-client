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

type DashboardItem =
  | SandboxFragmentDashboardFragment
  | SidebarCollectionDashboardFragment;

// define which fields to search, with per-key thresholds & weights
const SEARCH_KEYS = [
  { name: 'title', threshold: 0.2, weight: 0.4 },
  { name: 'description', threshold: 0.3, weight: 0.2 },
  { name: 'alias', threshold: 0.3, weight: 0.2 },
  { name: 'source.template', threshold: 0.4, weight: 0.1 },
  { name: 'id', threshold: 0.0, weight: 0.1 }, // exact-only
] as const;

interface SearchIndex {
  fuses: Record<string, Fuse<DashboardItem, any>>;
  weights: Record<string, number>;
  items: DashboardItem[];
}

const buildSearchIndex = (dashboard: any, activeTeam: string): SearchIndex => {
  const sandboxes: DashboardItem[] = dashboard.sandboxes.SEARCH || [];

  const folders: DashboardItem[] = (dashboard.allCollections || [])
    .map((c: Collection) => ({
      ...c,
      title: c.path,
    }))
    .filter(f => f.title);

  const repos: DashboardItem[] = (
    dashboard.repositoriesByTeamId[activeTeam] || []
  ).map((r: Repository) => ({
    title: r.repository.name,
    description: r.repository.owner,
    ...r,
  }));

  const items = [...sandboxes, ...folders, ...repos];

  // build a Fuse instance per key
  const fuses: Record<string, Fuse<DashboardItem, any>> = {};
  const weights: Record<string, number> = {};

  for (const { name, threshold, weight } of SEARCH_KEYS) {
    fuses[name] = new Fuse(items, {
      keys: [name],
      threshold,
      distance: 1000,
    });
    weights[name] = weight;
  }

  return { fuses, weights, items };
};

// merge+dedupe results from every key
const mergeSearchResults = (
  index: SearchIndex,
  query: string
): DashboardItem[] => {
  const hits: Array<DashboardItem> = [];

  for (const key of Object.keys(index.fuses)) {
    const fuse = index.fuses[key];
    for (const item of fuse.search(query)) {
      hits.push(item as DashboardItem);
    }
  }

  // dedupe by item.id, keep the best (lowest) weighted score
  const byId: Record<string, DashboardItem> = {};
  for (const item of hits) {
    const id = (item as any).id as string;
    if (!byId[id]) {
      byId[id] = item;
    }
  }

  // sort & return
  return Object.values(byId);
};

export const useGetItems = ({
  query,
  username,
  getFilteredSandboxes,
}: {
  query: string;
  username: string;
  getFilteredSandboxes: (
    list: DashboardItem[]
  ) => SandboxFragmentDashboardFragment[];
}) => {
  const state = useAppState();
  const actions = useActions();

  // load page once
  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.SEARCH);
  }, [actions.dashboard, state.activeTeam]);

  // keep a SearchIndex in state
  const [searchIndex, setSearchIndex] = React.useState<SearchIndex | null>(
    null
  );
  useEffect(() => {
    if (!state.dashboard.sandboxes.SEARCH || !state.dashboard.allCollections)
      return;
    const idx = buildSearchIndex(state.dashboard, state.activeTeam);
    setSearchIndex(idx);
  }, [
    state.dashboard.sandboxes.SEARCH,
    state.dashboard.allCollections,
    state.dashboard.repositoriesByTeamId,
    state.activeTeam,
  ]);

  // run the merged search whenever query or index changes
  const [foundResults, setFoundResults] = React.useState<DashboardItem[]>([]);
  useEffect(() => {
    if (searchIndex && query) {
      setFoundResults(mergeSearchResults(searchIndex, query));
    } else {
      setFoundResults([]);
    }
  }, [query, searchIndex]);

  // then the rest is just your existing filtering / mapping logic:
  const sandboxesInSearch = foundResults.filter(s => !(s as any).path);
  const foldersInSearch = foundResults.filter(s => (s as any).path);
  const filteredSandboxes = getFilteredSandboxes(sandboxesInSearch);
  const isLoadingQuery = query && !searchIndex;

  const ordered = [...foldersInSearch, ...filteredSandboxes].filter(item => {
    if ((item as any).path || (item as any).repository) return true;
    const sb = item as SandboxFragmentDashboardFragment;
    return !sb.draft || (sb.draft && sb.author.username === username);
  });

  const items = ordered.map(found => {
    if ((found as any).path) {
      return { type: 'folder', ...(found as object) } as any;
    }
    if ((found as any).repository) {
      const f = found as any;
      return {
        type: 'repository',
        repository: {
          branchCount: f.branchCount,
          repository: f.repository,
        },
      } as any;
    }
    return { type: 'sandbox', sandbox: found } as any;
  });

  return [items, sandboxesInSearch, isLoadingQuery] as const;
};
