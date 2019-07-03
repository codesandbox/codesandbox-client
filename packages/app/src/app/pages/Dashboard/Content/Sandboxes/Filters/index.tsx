import React from 'react';

import SortOptions from './SortOptions';
import FilterOptions from './FilterOptions';

import { Container } from './elements';
import { ITemplate } from '../types';

interface Props {
  possibleTemplates: ITemplate[];
  hideOrder?: boolean;
  hideFilters?: boolean;
}

export default ({ possibleTemplates, hideOrder, hideFilters }: Props) => (
  <Container>
    <FilterOptions
      hideFilters={hideFilters}
      possibleTemplates={possibleTemplates}
    />
    <SortOptions hideOrder={hideOrder} />
  </Container>
);
