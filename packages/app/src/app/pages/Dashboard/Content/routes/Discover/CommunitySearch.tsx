import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { InstantSearch, SearchBox, Configure } from 'react-instantsearch/dom';
import { connectHits } from 'react-instantsearch-dom';
import VisuallyHidden from '@reach/visually-hidden';

import { useAppState, useActions } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
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
import { Element, Stack } from '@codesandbox/components';

/** instantsearch is very specific about it's connect types,
 * so instead of passing props, I created a context here */
const LocalContext = React.createContext({
  setRefinement: (attribute: string, values: string[]) => null,
});

export const CommunitySearch = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [refinementList, setRefinementList] = React.useState({
    template: [],
    'npm_dependencies.dependency': [],
  });

  const setRefinement = (attribute: string, values: string[]) => {
    setRefinementList({ ...refinementList, [attribute]: values });
  };

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
        searchState={{ query, refinementList }}
      >
        <Configure hitsPerPage={100} />
        <VisuallyHidden>
          <SearchBox />
        </VisuallyHidden>
        <LocalContext.Provider value={{ setRefinement }}>
          <Results />
        </LocalContext.Provider>
      </InstantSearch>
    </Element>
  );
};

const Results = connectHits(({ hits }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const pageType: PageTypes = 'search';

  const {
    activeTeam,
    dashboard: { sandboxes },
  } = useAppState();
  const {
    dashboard: { getPage },
  } = useActions();

  React.useEffect(() => {
    getPage(sandboxesTypes.LIKED);
  }, [getPage]);

  const likedSandboxIds = (sandboxes.LIKED || []).map(sandbox => sandbox.id);

  const items: DashboardCommunitySandbox[] = hits.map(sandbox => ({
    noDrag: true,
    type: 'community-sandbox',
    sandbox: {
      id: sandbox.objectID,
      alias: sandbox.alias,
      title: sandbox.title,
      description: sandbox.description,
      screenshotUrl: `https://codesandbox.io/api/v1/sandboxes/${sandbox.objectID}/screenshot.png`,
      forkCount: Number(sandbox.fork_count),
      likeCount: Number(sandbox.like_count),
      source: { template: sandbox.template },
      author: {
        // @ts-ignore - Hit<BasicDoc> assumes every field
        // is a string even when it's an object
        username: sandbox.author?.username,
        // @ts-ignore
        avatarUrl: sandbox.author?.avatar_url,
      },
      liked: likedSandboxIds.includes(sandbox.objectID),
    },
  }));

  return (
    <SelectionProvider
      interactive={false}
      activeTeamId={activeTeam}
      page={pageType}
      items={items}
    >
      <Helmet>
        <title>
          {location.search
            ? `Search: '${query}' - CodeSandbox`
            : 'Search - CodeSandbox'}
        </title>
      </Helmet>
      <Stack>
        <Header
          title={`Search results for '${query}' in Community`}
          activeTeam={activeTeam}
          showViewOptions
        />
      </Stack>
      <VariableGrid items={items} page={pageType} />
    </SelectionProvider>
  );
});
