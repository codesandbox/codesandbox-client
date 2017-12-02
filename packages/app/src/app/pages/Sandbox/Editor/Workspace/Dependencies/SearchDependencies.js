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
    this.props.onConfirm(hit.name, selectedVersion);
  };
  hitComponent = hitComponent(this.handleHitClick);

  handleSearchStateChange = searchState => {
    this.setState({ searchState });
  };

  render() {
    const { searchState } = this.state;
    const showHits = searchState.query;
    return (
      <div>
        <InstantSearch
          appId="OFCNCOG2CU"
          apiKey="00383ecd8441ead30b1b0ff981c426f5"
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
