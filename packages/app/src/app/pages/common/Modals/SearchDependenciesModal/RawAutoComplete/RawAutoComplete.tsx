import React, { useState } from 'react';
import Downshift from 'downshift';
import { Pagination } from 'react-instantsearch/dom';
import { ENTER, ARROW_RIGHT } from '@codesandbox/common/lib/utils/keycodes';
import { DependencyHit } from '../DependencyHit';
import { AutoCompleteInput, SuggestionInput } from './elements';

export const RawAutoComplete = ({
  onSelect,
  onManualSelect,
  onHitVersionChange,
  hits,
  refine,
  currentRefinement,
}) => {
  const [value, setValue] = useState(``);

  const getName = (str: string) => {
    const scope = str[0] === '@' ? '@' : '';
    const val = scope ? str.substr(1) : str;
    return scope + val.split('@')[0];
  };

  const isExplicitVersion = (str: string) => {
    const scope = str[0] === '@' ? '@' : '';
    const val = scope ? str.substr(1) : str;
    return val.includes('@');
  };

  const getHit = (str: string, hits) => {
    return str && hits.find(hit => hit.name.startsWith(str));
  };

  const getVersion = (str: string, hit) => {
    return str.indexOf('@') > 0 ? str.split('@')[1] : hit ? hit.version : null;
  };

  const getIsValid = (str: string, hit, version: string) => {
    return Boolean(
      hit &&
        hit.name.startsWith(getName(str)) &&
        (version in hit.tags || version in hit.versions)
    );
  };

  const hit = getHit(currentRefinement, hits);
  const version = getVersion(value, hit);
  const isValid = getIsValid(value, hit, version);

  const autoCompletedQuery = isExplicitVersion(value)
    ? null
    : hit && isValid
    ? hit.name + '@' + hit.version
    : null;

  return (
    <Downshift itemToString={hit => (hit ? hit.name : hit)} onSelect={onSelect}>
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
                style={{
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
              onChange: (e: React.FormEvent<HTMLInputElement>) => {
                const name = e.target.value;
                setValue(name);
                if (name.indexOf('@') === 0) {
                  const parts = name.split('@');
                  refine(`@${parts[1]}`);
                  return;
                }
                const parts = name.split('@');
                refine(`${parts[0]}`);
              },
              onKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => {
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
          {hits.map((h, index: number) => (
            <DependencyHit
              key={h.name}
              highlighted={highlightedIndex === index}
              hit={h}
              onVersionChange={v => {
                onHitVersionChange(h, v);
              }}
              {...getItemProps({
                item: h,
                index,
                onClick: (e: React.SyntheticEvent, isDev = false) => {
                  e.nativeEvent.preventDownshiftDefault = true;
                  selectItem({ ...h, isDev });
                },
              })}
            />
          ))}
        </div>
      )}
    </Downshift>
  );
};
