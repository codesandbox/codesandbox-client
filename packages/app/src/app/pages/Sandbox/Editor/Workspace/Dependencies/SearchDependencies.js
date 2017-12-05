import React from 'react';
import {
  InstantSearch,
  Configure,
  Pagination,
  PoweredBy,
} from 'react-instantsearch/dom';
import { connectAutoComplete } from 'react-instantsearch/connectors';
import Downshift from 'downshift';
import styled from 'styled-components';
import theme from 'common/theme';

import 'app/pages/Search/Search.css';

import DependencyHit from './DependencyHit';
import './Dependencies.css';

const AutoCompleteInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: ${props => props.theme.background2};
  font-weight: 600;
  color: ${props => props.theme.white};
  padding: 0.75em 1em;
`;

type RawAutoCompleteProps = {
  onSelect: (hit: Object) => void,
  onManualSelect: (hit: string) => void,
  onHitVersionChange: (version: string) => void,
  hits: Array<Object>,
  refine: string,
  currentRefinement: Function,
};

function RawAutoComplete({
  onSelect,
  onManualSelect,
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
              placeholder: 'Search or enter npm dependency',
              onChange(e) {
                refine(e.target.value);
              },
              onKeyUp(e) {
                // If enter with no selection
                if (e.keyCode === 13) {
                  onManualSelect(e.target.value);
                }
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

  handleManualSelect = (hitName: string) => {
    const isScoped = hitName.startsWith('@');
    let version = 'latest';

    const splittedName = hitName.split('@');

    if (splittedName.length > (isScoped ? 2 : 1)) {
      version = splittedName.pop();
    }

    const depName = splittedName.join('@');

    this.props.onConfirm(depName, version);
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
          onManualSelect={this.handleManualSelect}
          onHitVersionChange={this.handleHitVersionChange}
        />
        <div
          style={{
            height: 40,
            backgroundColor: theme.background2.darken(0.2)(),
          }}
        >
          <PoweredBy />
        </div>
      </InstantSearch>
    );
  }
}
