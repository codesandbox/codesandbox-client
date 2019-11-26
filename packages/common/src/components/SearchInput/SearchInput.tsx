import React from 'react';
import { unstable_useFormState as useFormState } from 'reakit/Form';
import { GoSearch } from 'react-icons/go';
import { SearchForm, SearchButton, Input } from './elements';

export const SearchInput: React.FC = props => {
  const form = useFormState({ values: { name: '' } });
  return (
    <SearchForm {...form} {...props}>
      <Input {...form} name="search" placeholder="Search" />
      <SearchButton {...form}>
        <GoSearch />
      </SearchButton>
    </SearchForm>
  );
};
