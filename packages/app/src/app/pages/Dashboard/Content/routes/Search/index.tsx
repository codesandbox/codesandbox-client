import { useOvermind } from 'app/overmind';

import { Helmet } from 'react-helmet';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { PageTypes } from 'app/pages/Dashboard/types';

import { getPossibleTemplates } from '../../utils';
import { useGetItems } from './searchItems';

export const SearchComponent = () => {
  const {
    state: {
      activeTeam,
      dashboard: { getFilteredSandboxes },
    },
  } = useOvermind();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [items, filteredSandboxes] = useGetItems({
    query,
    getFilteredSandboxes,
  });
  const pageType: PageTypes = 'search';

  return (
    <SelectionProvider activeTeamId={activeTeam} page={pageType} items={items}>
      <Helmet>
        <title>
          {location.search
            ? `Search: '${query}' - CodeSandbox`
            : 'Search - CodeSandbox'}
        </title>
      </Helmet>
      <Header
        title={`Search results for '${query}'`}
        activeTeam={activeTeam}
        showViewOptions
        showFilters
        showSortOptions
        templates={getPossibleTemplates(filteredSandboxes)}
      />

      <section style={{ position: 'relative', height: '100%', width: '100%' }}>
        <VariableGrid items={items} page={pageType} />
      </section>
    </SelectionProvider>
  );
};

export const Search = SearchComponent;
