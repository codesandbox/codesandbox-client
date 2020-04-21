import React from 'react';
import { Element } from '@codesandbox/components';
import { FilterOptions } from './FilterOptions';
import { SortOptions } from './SortOptions';

export const Filters = ({ possibleTemplates }) => (
  <Element>
    <FilterOptions possibleTemplates={possibleTemplates} />

    <SortOptions />
  </Element>
);
