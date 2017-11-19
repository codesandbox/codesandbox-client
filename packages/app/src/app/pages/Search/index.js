import React from 'react';
import styled from 'styled-components';
import { InstantSearch, SearchBox, PoweredBy } from 'react-instantsearch/dom';
import qs from 'qs';

import Title from 'app/components/text/Title';
import MaxWidth from 'common/components/flex/MaxWidth';
import Margin from 'common/components/spacing/Margin';
import Row from 'common/components/flex/Row';

import Navigation from 'app/containers/Navigation';
import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX,
} from 'common/utils/config';

import './Search.css';
import Results from './Results';
import Filters from './Filters';

type Props = {
  location: {
    search: string,
  },
  history: {
    listen: Function,
    push: Function,
  },
};

const Content = styled.div`
  margin-top: 5%;
  text-align: left;
  color: white;
`;

const StyledTitle = styled(Title)`
  display: inline-block;
  text-align: left;
  font-size: 2rem;
`;

const SEARCHABLE_THINGS = [
  'dependency',
  'user',
  'sandbox title',
  'sandbox tag',
  'github repository',
];

const updateAfter = 700;

const getRandomSearch = () =>
  SEARCHABLE_THINGS[Math.floor(Math.random() * SEARCHABLE_THINGS.length)];

const createURL = state => `?${qs.stringify(state)}`;

const searchStateToUrl = (props, searchState) =>
  searchState ? `${props.location.pathname}${createURL(searchState)}` : '';

export default class Search extends React.PureComponent<Props> {
  constructor(props) {
    super(props);
    this.state = { searchState: qs.parse(props.location.search.slice(1)) };

    this.unlisten = this.props.history.listen((location, action) => {
      if (action === 'PUSH') {
        this.setState({
          searchState: qs.parse(location.search.slice(1)),
        });
      }
    });
  }

  componentWillUnmount() {
    this.unlisten();
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
      <MaxWidth>
        <Margin vertical={1.5} horizontal={1.5}>
          <Navigation title="Search" />
          <Content>
            <MaxWidth width={1024}>
              <InstantSearch
                appId={ALGOLIA_APPLICATION_ID}
                apiKey={ALGOLIA_API_KEY}
                indexName={ALGOLIA_DEFAULT_INDEX}
                searchState={this.state.searchState}
                onSearchStateChange={this.onSearchStateChange}
                createURL={createURL}
              >
                <StyledTitle>Sandbox Search</StyledTitle>
                <PoweredBy />
                <SearchBox
                  autoFocus
                  translations={{
                    placeholder: `Search for a ${getRandomSearch()}...`,
                  }}
                />
                <Row alignItems="flex-start">
                  <Results />
                  <Filters />
                </Row>
              </InstantSearch>
            </MaxWidth>
          </Content>
        </Margin>
      </MaxWidth>
    );
  }
}
