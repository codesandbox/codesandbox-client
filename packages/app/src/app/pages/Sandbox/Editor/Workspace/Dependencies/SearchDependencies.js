import React from 'react';
import {
  InstantSearch,
  Configure,
  Hits,
  SearchBox,
} from 'react-instantsearch/dom';

import 'app/pages/Search/Search.css';
import './Dependencies.css';

import { hitComponent } from './DependencyHit';

type Props = {
  onConfirm: (dependency: string, version: string) => Promise<boolean>,
};

type State = {
  searchState: Object,
};

const initialState: State = {
  searchState: {},
};

export default class SearchDependencies extends React.PureComponent {
  props: Props;
  state = initialState;

  handleHitClick = (hit, selectedVersion) => {
    console.log(hit.name); // eslint-disable-line
    console.log(selectedVersion); // eslint-disable-line
    if (false) {
      this.props.onConfirm(hit.name, selectedVersion);
    }
  };
  hitComponent = hitComponent(this.handleHitClick);

  handleSearchStateChange = searchState => {
    this.setState({ searchState });
  };

  render() {
    const { searchState } = this.state;
    const showHits = searchState.query;
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
          <Configure hitsPerPage={5} />
          <SearchBox autoFocus />
          {showHits && <Hits hitComponent={this.hitComponent} />}
        </InstantSearch>
      </div>
    );
  }
}
