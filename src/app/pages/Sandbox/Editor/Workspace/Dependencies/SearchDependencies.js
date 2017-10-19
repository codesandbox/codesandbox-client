import React from 'react';
import { InstantSearch, SearchBox } from 'react-instantsearch/dom';

import {
  ALGOLIA_API_KEY,
  ALGOLIA_APPLICATION_ID,
  ALGOLIA_DEFAULT_INDEX,
} from 'app/utils/config';

import 'app/pages/Search/Search.css';

type State = {
  searchState: string,
};

const initialState = {
  searchState: 'foo',
};

export default class SearchDependencies extends React.PureComponent {
  state: State;

  state = initialState;

  onSearchStateChange = searchState => {
    console.log(searchState); // eslint-disable-line
    this.setState({ searchState });
  };

  render() {
    return (
      <InstantSearch
        appId={ALGOLIA_APPLICATION_ID}
        apiKey={ALGOLIA_API_KEY}
        indexName={ALGOLIA_DEFAULT_INDEX}
        searchState={this.state.searchState}
        onSearchStateChange={this.onSearchStateChange}
      >
        <SearchBox autoFocus />
      </InstantSearch>
    );
  }
}
