import { action } from '@storybook/addon-actions';
import React from 'react';

import { SearchInput } from '.';

export default {
  title: 'components/SearchInput',
  component: SearchInput,
};

export const Basic = () => <SearchInput />;
export const Placeholder = () => (
  <SearchInput placeholder="Search For Dependencies" />
);
export const Label = () => (
  <SearchInput label="Search For Dependencies" placeholder="react" />
);

export const onChange = () => (
  <SearchInput
    onChange={action('search input change')}
    label="Search For Dependencies"
    placeholder="react"
  />
);
