import React from 'react';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch/dom';

import Button from 'app/components/buttons/Button';
import 'app/pages/Search/Search.css';

import { hitComponent } from './DependencyHit';

type Props = {
  onConfirm: (dependency: string, version: string) => Promise<boolean>,
};

type State = {
  searchState: Object,
  selectedHit: Object,
};

const initialState: State = {
  searchState: {},
  selectedHit: null,
};

export default class SearchDependencies extends React.PureComponent {
  props: Props;
  state = initialState;

  selectRef = ref => {
    this.versionSelect = ref;
  };

  makeOnClick = hit => () => {
    this.setState({ searchState: { query: hit.name }, selectedHit: hit });
  };
  hitComponent = hitComponent(this.makeOnClick);

  handleConfirm = () => {
    const { selectedHit } = this.state;
    this.props.onConfirm(selectedHit.name, this.versionSelect.value);
  };

  handleSearchStateChange = searchState => {
    this.setState({ searchState, selectedHit: null });
  };

  render() {
    const { searchState, selectedHit } = this.state;
    const showHits = searchState.query && !selectedHit;
    const versions = selectedHit ? Object.keys(selectedHit.versions) : [];
    if (versions.length) {
      versions.reverse();
    }
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
          <SearchBox autoFocus />
          {showHits && <Hits hitComponent={this.hitComponent} />}
          <select ref={this.selectRef}>
            {selectedHit && versions.map(v => <option value={v}>{v}</option>)}
          </select>
          <Button
            disabled={!selectedHit}
            block
            small
            onClick={this.handleConfirm}
          >
            Add Package
          </Button>
        </InstantSearch>
      </div>
    );
  }
}
