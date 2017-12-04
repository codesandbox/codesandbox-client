import React from 'react';
import { InstantSearch, Configure, Pagination } from 'react-instantsearch/dom';
import { connectAutoComplete } from 'react-instantsearch/connectors';
import Downshift from 'downshift';
import styled from 'styled-components';

import 'app/pages/Search/Search.css';

import DependencyHit from './DependencyHit';
import './Dependencies.css';

const AutoCompleteInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.white};
  padding: 1em;
}`;

type RawAutoCompleteProps = {
  onSelect: (hit: Object) => void,
  onHitVersionChange: (version: string) => void,
  hits: Array<Object>,
  refine: string,
  currentRefinement: Function,
};

function RawAutoComplete({
  onSelect,
  onHitVersionChange,
  hits,
  refine,
  currentRefinement,
}: RawAutoCompleteProps) {
  return (
    <Downshift itemToString={hit => (hit ? hit.name : hit)} onSelect={onSelect}>
      {({ getInputProps, getItemProps, highlightedIndex }) => (
        <div>
          <AutoCompleteInput
            {...getInputProps({
              innerRef(ref) {
                if (ref) {
                  ref.focus();
                }
              },
              value: currentRefinement,
              onChange(e) {
                refine(e.target.value);
              },
            })}
          />
          <Pagination />
          <div>
            {hits.map((hit, index) => (
              <DependencyHit
                key={hit.name}
                {...getItemProps({
                  item: hit,
                  index,
                  highlighted: highlightedIndex === index,
                  hit,
                  // Downshift supplies onClick
                  onVersionChange(version) {
                    onHitVersionChange(hit, version);
                  },
                })}
              />
            ))}
          </div>
        </div>
      )}
    </Downshift>
  );
}

const ConnectedAutoComplete = connectAutoComplete(RawAutoComplete);

type Props = {
  onConfirm: (dependency: string, version: string) => Promise<boolean>,
};

export default class SearchDependencies extends React.PureComponent {
  props: Props;
  hitToVersionMap = new Map();

  handleSelect = hit => {
    const version = this.hitToVersionMap.get(hit);
    this.props.onConfirm(hit.name, version);
  };

  handleHitVersionChange = (hit, version) => {
    this.hitToVersionMap.set(hit, version);
  };

  render() {
    return (
      <InstantSearch
        appId="OFCNCOG2CU"
        apiKey="00383ecd8441ead30b1b0ff981c426f5"
        indexName="npm-search"
      >
        <Configure hitsPerPage={5} />
        <ConnectedAutoComplete
          onSelect={this.handleSelect}
          onHitVersionChange={this.handleHitVersionChange}
        />
      </InstantSearch>
    );
  }
}
