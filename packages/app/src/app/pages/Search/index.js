import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX,
} from '@codesandbox/common/lib/utils/config';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import qs from 'qs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  InstantSearch,
  SearchBox,
  PoweredBy,
  Configure,
} from 'react-instantsearch/dom';

import Navigation from 'app/pages/common/Navigation';
import { inject, hooksObserver } from 'app/componentConnectors';

import 'instantsearch.css/themes/reset.css';

import { Container, Content, Main, StyledTitle } from './elements';
import Filters from './Filters';
import Results from './Results';
import Styles from './search';

const updateAfter = 700;

const createURL = state => `?${qs.stringify(state)}`;

const searchStateToUrl = (location, searchState) =>
  searchState ? `${location.pathname}${createURL(searchState)}` : '';

const Search = inject('signals')(
  hooksObserver(({ history, location, signals: { searchMounted } }) => {
    const [searchState, setSearchState] = useState(
      qs.parse(location.search.slice(1))
    );
    const debouncedSetState = useRef(null);

    useEffect(() => {
      document.title = 'Search - CodeSandbox';
    }, []);

    useEffect(() => {
      searchMounted();
    }, [searchMounted]);

    useEffect(() => {
      const unlisten = history.listen((loc, action) => {
        if (['POP', 'PUSH'].includes(action)) {
          setSearchState(qs.parse(loc.search.slice(1)));
        }

        return unlisten;
      });
    }, [history]);

    const onSearchStateChange = useCallback(
      newSearchState => {
        clearTimeout(debouncedSetState.current);

        debouncedSetState.current = setTimeout(() => {
          history.push(
            searchStateToUrl(location, newSearchState),
            newSearchState
          );
        }, updateAfter);

        setSearchState(newSearchState);
      },
      [history, location]
    );

    return (
      <Container>
        <Styles />

        <MaxWidth>
          <Margin vertical={1.5}>
            <Navigation title="Search" searchNoInput />

            <Content>
              <InstantSearch
                appId={ALGOLIA_APPLICATION_ID}
                apiKey={ALGOLIA_API_KEY}
                createURL={createURL}
                indexName={ALGOLIA_DEFAULT_INDEX}
                onSearchStateChange={onSearchStateChange}
                searchState={searchState}
              >
                <Configure hitsPerPage={12} />

                <Main alignItems="flex-start">
                  <div>
                    <StyledTitle>Search</StyledTitle>

                    <PoweredBy />

                    <SearchBox
                      autoFocus
                      translations={{ placeholder: 'Search Sandboxes...' }}
                    />

                    <Results />
                  </div>

                  <Filters />
                </Main>
              </InstantSearch>
            </Content>
          </Margin>
        </MaxWidth>
      </Container>
    );
  })
);

export default Search;
