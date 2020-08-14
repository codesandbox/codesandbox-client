import React, { useState, useEffect } from 'react';
import { Input } from '@codesandbox/components';
import css from '@styled-system/css';

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return debouncedValue;
}

export const SearchBox = ({ handleManualSelect, onDebouncedChange }) => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchTerm = useDebounce(searchValue, 100);

  useEffect(() => {
    if (debouncedSearchTerm) {
      onDebouncedChange(debouncedSearchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  return (
    <form onSubmit={() => handleManualSelect(searchValue)}>
      <Input
        placeholder="Add npm dependency"
        css={css({
          height: 65,
          fontSize: 4,
          color: 'white',
          backgroundColor: 'sideBar.background',
        })}
        onChange={e => setSearchValue(e.target.value)}
        value={searchValue}
      />
    </form>
  );
};
