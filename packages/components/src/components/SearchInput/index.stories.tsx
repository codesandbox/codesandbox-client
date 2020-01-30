import React from 'react';
import { action } from '@storybook/addon-actions';
import { SearchInput } from '.';

export default {
  title: 'components/SearchInput',
  component: SearchInput,
};

export const Placeholder = () => (
  <SearchInput placeholder="Search For Dependencies" />
);

export const onChange = () => (
  <SearchInput
    onChange={action('search input change')}
    label="Search For Dependencies"
    placeholder="react"
  />
);
