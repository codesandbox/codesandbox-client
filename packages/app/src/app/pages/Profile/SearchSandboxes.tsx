import React from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';
import { SearchInput } from './elements';

export const SearchSandboxes: React.ComponentClass = connectSearchBox(
  ({ refine }) => (
    <SearchInput
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        refine(e.currentTarget.value);
      }}
    />
  )
);
