import React from 'react';
import { inject } from 'mobx-react';
import { InstantSearch, SearchBox, PoweredBy } from 'react-instantsearch/dom';
import qs from 'qs';

import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';

import Navigation from 'app/pages/common/Navigation';
import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX,
} from '@codesandbox/common/lib/utils/config';

import 'instantsearch.css/themes/reset.css';
import Styles from './search';

import Results from './Results';
import Filters from './Filters';
import { Content, StyledTitle, Main, Container } from './elements';

const updateAfter = 700;

const createURL = state => `?${qs.stringify(state)}`;

const searchStateToUrl = (props, searchState) =>
  searchState ? `${props.location.pathname}${createURL(searchState)}` : '';

class Search extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchState: qs.parse(props.location.search.slice(1)),
    };

    this.unlisten = this.props.history.listen((location, action) => {
      if (action === 'PUSH' || action === 'POP') {
        this.setState({
          searchState: qs.parse(location.search.slice(1)),
        });
      }
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  componentDidMount() {
    this.props.signals.searchMounted();
  }

  onSearchStateChange = searchState => {
    clearTimeout(this.debouncedSetState);
    this.debouncedSetState = setTimeout(() => {
      this.props.history.push(
        searchStateToUrl(this.props, searchState),
        searchState
      );
    }, updateAfter);
    this.setState({ searchState });
  };

  render() {
    document.title = 'Search - CodeSandbox';
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
                indexName={ALGOLIA_DEFAULT_INDEX}
                searchState={this.state.searchState}
                onSearchStateChange={this.onSearchStateChange}
                createURL={createURL}
              >
                <Main alignItems="flex-start">
                  <div>
                    <StyledTitle>Search</StyledTitle>
                    <PoweredBy />
                    <SearchBox
                      autoFocus
                      translations={{
                        placeholder: `Search Sandboxes...`,
                      }}
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
  }
}

export default inject('signals')(Search);
