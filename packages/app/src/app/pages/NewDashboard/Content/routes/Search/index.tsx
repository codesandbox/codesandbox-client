import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Helmet } from 'react-helmet';
import Fuse from 'fuse.js';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { VariableGrid } from 'app/pages/NewDashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DashboardGridItem } from 'app/pages/NewDashboard/types';
import { SandboxFragmentDashboardFragment } from 'app/graphql/types';
import { getPossibleTemplates } from '../../utils';

const useSearchedSandboxes = (query: string) => {
  const { actions, state } = useOvermind();
  const [foundSandboxes, setFoundSandboxes] = React.useState<
    SandboxFragmentDashboardFragment[] | null
  >(null);

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.SEARCH);
  }, [actions.dashboard, state.activeTeam]);

  const searchIndex = React.useMemo<Fuse<
    SandboxFragmentDashboardFragment,
    {}
  > | null>(() => {
    const sandboxes = state.dashboard.sandboxes.SEARCH;
    if (sandboxes == null) {
      return null;
    }

    return new Fuse(sandboxes, {
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
  }, [state.dashboard.sandboxes.SEARCH]);

  useEffect(() => {
    if (searchIndex) {
      setFoundSandboxes(searchIndex.search(query));
    }
  }, [query, searchIndex]);

  return foundSandboxes;
};

export const SearchComponent = () => {
  const {
    state: {
      dashboard: { getFilteredSandboxes },
    },
  } = useOvermind();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const foundSandboxes = useSearchedSandboxes(query);

  const items: DashboardGridItem[] =
    foundSandboxes != null
      ? getFilteredSandboxes(foundSandboxes).map(sandbox => ({
          type: 'sandbox',
          sandbox,
        }))
      : [{ type: 'skeleton-row' }];

  return (
    <SelectionProvider page="search" items={items}>
      <Helmet>
        <title>
          {location.search
            ? `Search: '${query}' - CodeSandbox`
            : 'Search - CodeSandbox'}
        </title>
      </Helmet>
      <Header
        title={`Search results for '${query}'`}
        showViewOptions
        showFilters
        showSortOptions
        templates={getPossibleTemplates(foundSandboxes)}
      />

      <section style={{ position: 'relative' }}>
        <VariableGrid items={items} />
      </section>
    </SelectionProvider>
  );
};

export const Search = SearchComponent;
