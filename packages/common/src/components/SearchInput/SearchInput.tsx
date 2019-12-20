import React, { useEffect } from 'react';
import {
  unstable_useFormState as useFormState,
  unstable_FormInitialState as initialFormState,
} from 'reakit/Form';
import GoSearch from 'react-icons/go/search';
import { SearchForm, SearchButton, Input } from './elements';

type V = Record<any, any>;

export interface ISearchInputProps
  extends Omit<React.ComponentProps<typeof SearchForm>, 'baseId' | 'submit'> {
  name?: string;
  placeholder?: string;
  onChange?: (values: V) => void;
  onValidate?: initialFormState<V>['onValidate'];
  onSubmit?: initialFormState<V>['onSubmit'];
}

export const SearchInput: React.FC<ISearchInputProps> = ({
  name = `query`,
  placeholder = `Search`,
  onChange = () => {},
  onValidate,
  onSubmit,
  ...props
}) => {
  const form = useFormState({ values: { [name]: '' }, onValidate, onSubmit });

  useEffect(() => {
    onChange(form.values);
  }, [onChange, form.values]);

  return (
    <SearchForm {...form} {...props}>
      <Input {...form} name={name} placeholder={placeholder} />
      <SearchButton {...form}>
        <GoSearch />
      </SearchButton>
    </SearchForm>
  );
};
