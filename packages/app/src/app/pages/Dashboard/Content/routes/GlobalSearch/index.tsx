import React from 'react';
import { useOvermind } from 'app/overmind';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { InstantSearch, SearchBox } from 'react-instantsearch/dom';
import { connectHits } from 'react-instantsearch-dom';
import VisuallyHidden from '@reach/visually-hidden';

import { Header } from 'app/pages/Dashboard/Components/Header';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import {
  DashboardCommunitySandbox,
  PageTypes,
} from 'app/pages/Dashboard/types';

import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX,
} from '@codesandbox/common/lib/utils/config';

import { Element } from '@codesandbox/components';

export const GlobalSearch = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  return (
    <Element
      as="section"
      css={{
        position: 'relative',
        height: '100%',
        width: '100%',
        '> div': { height: '100%' },
      }}
    >
      <InstantSearch
        apiKey={ALGOLIA_API_KEY}
        appId={ALGOLIA_APPLICATION_ID}
        indexName={ALGOLIA_DEFAULT_INDEX}
        searchState={{ query }}
      >
        <VisuallyHidden>
          <SearchBox />
        </VisuallyHidden>
        <Results />
      </InstantSearch>
    </Element>
  );
};

const Results = connectHits(({ hits }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const pageType: PageTypes = 'search';

  const {
    state: { activeTeam },
  } = useOvermind();

  const items: DashboardCommunitySandbox[] = hits.map(sandbox => ({
    noDrag: true,
    type: 'searched-sandbox',
    sandbox: {
      id: sandbox.alias,
      alias: sandbox.alias,
      title: sandbox.title,
      description: sandbox.description,
      updatedAt: sandbox.updated_at,
      screenshotUrl: `https://codesandbox.io/api/v1/sandboxes/${sandbox.alias}/screenshot.png`,
      viewCount: Number(sandbox.view_count),
    },
  }));

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
      <VariableGrid items={items} page={pageType} />;
    </SelectionProvider>
  );
});
