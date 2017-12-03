import React from 'react';
import { InstantSearch, Configure } from 'react-instantsearch/dom';
import { connectAutoComplete } from 'react-instantsearch/connectors';
import Downshift from 'downshift';
import styled from 'styled-components';

import DependencyHit from './DependencyHit';

import 'app/pages/Search/Search.css';
import './Dependencies.css';

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
        <Configure hitsPerPage={5} />
        <ConnectedAutoComplete
          onSelect={this.handleSelect}
          onHitClick={this.handleHitClick}
          onHitVersionChange={this.handleHitVersionChange}
        />
      </InstantSearch>
    );
  }
}

const AutoCompleteInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.white};
  padding: 1em;
}`;

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
  return (
    <Downshift itemToString={hit => (hit ? hit.name : hit)} onSelect={onSelect}>
      {({ getInputProps, getItemProps, highlightedIndex }) => (
        <div>
          <AutoCompleteInput
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
    </Downshift>
  );
}

const ConnectedAutoComplete = connectAutoComplete(RawAutoComplete);
