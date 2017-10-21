import React from 'react';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch/dom';

import 'app/pages/Search/Search.css';

import { hitComponent } from './DependencyHit';

type State = {
  searchState: Object,
  selectedHit: Object,
};

const initialState: State = {
  searchState: {},
  selectedHit: null,
};

export default class SearchDependencies extends React.PureComponent {
  state = initialState;

  makeHitOnClick = hit => () => {
    console.log(hit); // eslint-disable-line
    this.setState({ searchState: { query: hit.name }, selectedHit: hit });
  };
  hitComponent = hitComponent(this.makeHitOnClick);

  handleSearchStateChange = searchState => {
    console.log(searchState); // eslint-disable-line
    this.setState({ searchState, selectedHit: null });
  };

  render() {
    const { searchState, selectedHit } = this.state;
    const showHits =
      !selectedHit || (searchState && searchState.query !== selectedHit.name);
    // Copied from https://github.com/yarnpkg/website/blob/956150946634b1e6ae8c3aebd3fd269744180738/scripts/sitemaps.js
    // TODO: Use our own key
    return (
      <div>
        <InstantSearch
          appId="OFCNCOG2CU"
          apiKey="f54e21fa3a2a0160595bb058179bfb1e"
          indexName="npm-search"
          searchState={searchState}
          onSearchStateChange={this.handleSearchStateChange}
        >
          <SearchBox />
          {showHits && <Hits hitComponent={this.hitComponent} />}
        </InstantSearch>
      </div>
    );
  }
}
