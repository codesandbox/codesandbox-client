import React from 'react';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch/dom';

import 'app/pages/Search/Search.css';

import { hitComponent } from './DependencyHit';

type State = {
  selectedHit: Object,
};

const initialState: State = {
  selectedHit: null,
};

export default class SearchDependencies extends React.PureComponent {
  state = initialState;

  makeHitOnClick = hit => () => {
    console.log(hit); // eslint-disable-line
    this.setState({ selectedHit: hit });
  };
  hitComponent = hitComponent(this.makeHitOnClick);

  render() {
    // Copied from https://github.com/yarnpkg/website/blob/956150946634b1e6ae8c3aebd3fd269744180738/scripts/sitemaps.js
    // TODO: Use our own key
    return (
      <InstantSearch
        appId="OFCNCOG2CU"
        apiKey="f54e21fa3a2a0160595bb058179bfb1e"
        indexName="npm-search"
      >
        <SearchBox />
        <Hits hitComponent={this.hitComponent} />
      </InstantSearch>
    );
  }
}
