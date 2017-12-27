import React from 'react';
import Downshift from 'downshift';

import { Pagination } from 'react-instantsearch/dom';

import DependencyHit from '../DependencyHit';
import { AutoCompleteInput } from './elements';

function RawAutoComplete({
  onSelect,
  onManualSelect,
  onHitVersionChange,
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

export default RawAutoComplete;
