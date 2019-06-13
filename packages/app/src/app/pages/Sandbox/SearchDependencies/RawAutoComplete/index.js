import React, { useState } from 'react';
import Downshift from 'downshift';
import { Pagination } from 'react-instantsearch/dom';
import { ENTER, ARROW_RIGHT } from '@codesandbox/common/lib/utils/keycodes';
import { DependencyHit } from '../DependencyHit';
import { AutoCompleteInput, SuggestionInput } from './elements';

/* eslint-disable no-param-reassign */

function getName(value: string) {
  const scope = value[0] === '@' ? '@' : '';
  value = scope ? value.substr(1) : value;

  return scope + value.split('@')[0];
}

function isExplicitVersion(value: string) {
  const scope = value[0] === '@' ? '@' : '';
  value = scope ? value.substr(1) : value;

  return value.includes('@');
}

function getVersion(value: string, hit) {
  return value.indexOf('@') > 0
    ? value.split('@')[1]
    : hit
    ? hit.version
    : null;
}

function getIsValid(value: string, hit, version: string) {
  return Boolean(
    hit &&
      hit.name.startsWith(getName(value)) &&
      (version in hit.tags || version in hit.versions)
  );
}

function getHit(value: string, hits) {
  return value && hits.find(hit => hit.name.startsWith(value));
}

export const RawAutoComplete = ({
  onSelect,
  onManualSelect,
  onHitVersionChange,
  hits,
  refine,
  currentRefinement,
}) => {
  const [value, setValue] = useState('');

  const hit = getHit(currentRefinement, hits);
  const version = getVersion(value, hit);
  const isValid = getIsValid(value, hit, version);

  const autoCompletedQuery = isExplicitVersion(value)
    ? null
    : hit && isValid
    ? hit.name + '@' + hit.version
    : null;

  return (
    <Downshift itemToString={h => (h ? h.name : h)} onSelect={onSelect}>
      {({ getInputProps, getItemProps, highlightedIndex, selectItem }) => (
        <div>
          {highlightedIndex == null && (
            <SuggestionInput as="div">
              {isExplicitVersion(value)
                ? value
                : hit
                ? hit.name
                : currentRefinement}
              <span
                css={{
                  color: 'var(--color-white-3)',
                }}
              >
                {isExplicitVersion(value)
                  ? null
                  : hit && isValid
                  ? '@' + hit.version
                  : null}
              </span>
            </SuggestionInput>
          )}
          <AutoCompleteInput
            autoFocus
            {...getInputProps({
              innerRef(ref) {
                if (ref) {
                  if (
                    document.activeElement &&
                    document.activeElement.tagName !== 'SELECT'
                  ) {
                    ref.focus();
                  }
                }
              },
              value,
              placeholder: 'Search or enter npm dependency',

              onChange: e => {
                const name = e.target.value;

                setValue(name);
                if (name.indexOf('@') === 0) {
                  const parts = name.split('@');

                  refine(`@${parts[1]}`);
                  return;
                }

                const parts = name.split('@');

                requestAnimationFrame(() => {
                  refine(`${parts[0]}`);
                });
              },

              onKeyUp: e => {
                // If enter with no selection
                if (e.keyCode === ENTER) {
                  onManualSelect(autoCompletedQuery || e.target.value);
                } else if (autoCompletedQuery && e.keyCode === ARROW_RIGHT) {
                  setValue(autoCompletedQuery);
                }
              },
            })}
          />
          <Pagination />
          {hits.map((h, index) => (
            <DependencyHit
              key={h.name}
              {...getItemProps({
                item: h,
                index,
                highlighted: highlightedIndex === index,
                hit: h,
                onClick: (event, isDev = false) => {
                  event.nativeEvent.preventDownshiftDefault = true;
                  selectItem({ ...h, isDev });
                },
                onVersionChange(v) {
                  onHitVersionChange(h, v);
                },
              })}
            />
          ))}
        </div>
      )}
    </Downshift>
  );
};
