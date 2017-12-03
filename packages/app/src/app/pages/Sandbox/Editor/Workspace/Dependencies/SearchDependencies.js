import React from 'react';
import {
  InstantSearch,
  Configure,
  Hits,
  SearchBox,
} from 'react-instantsearch/dom';
import { connectAutoComplete } from 'react-instantsearch/connectors';
import Downshift from 'downshift';

import 'app/pages/Search/Search.css';
import './Dependencies.css';

import DependencyHit from './DependencyHit';

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
  hitToVersionMap = new Map();

  handleSelect = hit => {
    const version = this.hitToVersionMap.get(hit);
    this.props.onConfirm(hit.name, version);
  };

  handleHitVersionChange = (hit, version) => {
    this.hitToVersionMap.set(hit, version);
  };

  render() {
    const { searchState } = this.state;
    return (
      <InstantSearch
        appId="OFCNCOG2CU"
        apiKey="00383ecd8441ead30b1b0ff981c426f5"
        indexName="npm-search"
      >
        <ConnectedAutoComplete
          onSelect={this.handleSelect}
          onHitClick={this.handleHitClick}
          onHitVersionChange={this.handleHitVersionChange}
        />
      </InstantSearch>
    );
  }
}

function RawAutoComplete({
  /* Props */
  onSelect,
  onHitClick,
  onHitVersionChange,
  /* From connectAutoComplete*/
  hits,
  refine,
  currentRefinement,
}) {
  return [
    <Configure key="configure" hitsPerPage={5} />,
    <Downshift
      key="downshift"
      itemToString={hit => (hit ? hit.name : hit)}
      onSelect={onSelect}
    >
      {({ getInputProps, getItemProps, highlightedIndex }) => (
        <div>
          <input
            {...getInputProps({
              value: currentRefinement,
              onChange(e) {
                refine(e.target.value);
              },
            })}
          />
          {!!currentRefinement && (
            <div>
              {hits.map((hit, index) => (
                <DependencyHit
                  key={hit.name}
                  {...getItemProps({
                    item: hit,
                    index,
                    highlighted: highlightedIndex === index,
                    hit: hit,
                    /* Downshift supplies onClick */
                    onVersionChange(version) {
                      onHitVersionChange(hit, version);
                    },
                  })}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Downshift>,
  ];
}

const ConnectedAutoComplete = connectAutoComplete(RawAutoComplete);
