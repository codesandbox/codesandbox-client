import { useAppState } from 'app/overmind';

import { Stack, Text } from '@codesandbox/components';
import { Helmet } from 'react-helmet';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import React from 'react';
import { useLocation } from 'react-router-dom';
import { PageTypes } from 'app/pages/Dashboard/types';

import { useGetItems } from './searchItems';

export const SearchComponent = () => {
  const {
    activeTeam,
    dashboard: { getFilteredSandboxes },
    user,
  } = useAppState();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [items, , isLoadingQuery] = useGetItems({
    query,
    username: user?.username,
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
        title={`Search results for '${query}' in Workspace`}
        activeTeam={activeTeam}
        showViewOptions
        showSortOptions
      />

      <section style={{ position: 'relative', height: '100%', width: '100%' }}>
        {items.length > 0 ? (
          <VariableGrid items={items} page={pageType} />
        ) : (
          <Stack justify="center" align="center" marginTop={120}>
            <Text variant="muted">
              {isLoadingQuery
                ? 'Loading index...'
                : 'There are no sandboxes, branches or repositories that match your query'}
            </Text>
          </Stack>
        )}
      </section>
    </SelectionProvider>
  );
};

export const Search = SearchComponent;
