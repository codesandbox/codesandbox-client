import React from 'react';
import { Stack } from '@codesandbox/components';
import { FilterOptions } from './FilterOptions';
import { ViewOptions } from './ViewOptions';
import { SortOptions } from './SortOptions';

export const Filters = ({ possibleTemplates }) => (
  <Stack gap={4}>
    <FilterOptions possibleTemplates={possibleTemplates} />
    <SortOptions />
    <ViewOptions />
  </Stack>
);
