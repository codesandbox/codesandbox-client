import React from 'react';
import { useOvermind } from 'app/overmind';
import { Helmet } from 'react-helmet';
import { useLocation, useHistory } from 'react-router-dom';
import { InstantSearch } from 'react-instantsearch/dom';
import { connectHits } from 'react-instantsearch-dom';

import { Header } from 'app/pages/Dashboard/Components/Header';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { PageTypes } from 'app/pages/Dashboard/types';

import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX,
} from '@codesandbox/common/lib/utils/config';

export const GlobalSearch = () => {
  const {
    state: {
      activeTeam,
      dashboard: { getFilteredSandboxes },
    },
  } = useOvermind();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  const pageType: PageTypes = 'search';

  const [items, setItems] = React.useState([]);

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
      />
      <InstantSearch
        apiKey={ALGOLIA_API_KEY}
        appId={ALGOLIA_APPLICATION_ID}
        indexName={ALGOLIA_DEFAULT_INDEX}
      >
        <Results setItems={setItems} />
      </InstantSearch>
      <section style={{ position: 'relative', height: '100%', width: '100%' }}>
        <VariableGrid items={items} page={pageType} />
      </section>
    </SelectionProvider>
  );
};

const Results = connectHits(({ hits, setItems }) => {
  // "steal" results from the connected component
  const items = hits.map(sandbox => {
    return {
      type: 'sandbox',
      sandbox: {
        ...sandbox,
        updatedAt: sandbox.updated_at,
        screenshotUrl: `https://codesandbox.io/api/v1/sandboxes/${sandbox.alias}/screenshot.png`,
      },
    };
  });
  setItems(items);
  return null;
});
