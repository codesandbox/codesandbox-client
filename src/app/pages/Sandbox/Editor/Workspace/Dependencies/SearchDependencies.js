import React from 'react';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch/dom';

import 'app/pages/Search/Search.css';

import DependencyHit from './DependencyHit';

type State = {
  searchState: Object,
};

const initialState = {
  searchState: {},
};

export default class SearchDependencies extends React.PureComponent {
  state: State;

  state = initialState;

  onSearchStateChange = searchState => {
    this.setState({ searchState });
  };

  render() {
    // Copied from https://github.com/yarnpkg/website/blob/956150946634b1e6ae8c3aebd3fd269744180738/scripts/sitemaps.js
    // TODO: Use our own key
    return (
      <InstantSearch
        appId="OFCNCOG2CU"
        apiKey="f54e21fa3a2a0160595bb058179bfb1e"
        indexName="npm-search"
        searchState={this.state.searchState}
        onSearchStateChange={this.onSearchStateChange}
      >
        <SearchBox />
        <Hits hitComponent={DependencyHit} />
      </InstantSearch>
    );
  }
}
