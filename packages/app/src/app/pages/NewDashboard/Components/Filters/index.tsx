import React from 'react';
import { Stack } from '@codesandbox/components';
import { FilterOptions } from './FilterOptions';
import { SortOptions } from './SortOptions';

export const Filters = ({ possibleTemplates }) => (
  <Stack gap={4}>
    <FilterOptions possibleTemplates={possibleTemplates} />

    <SortOptions />
  </Stack>
);
