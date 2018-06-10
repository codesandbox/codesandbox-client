import React from 'react';

import SortOptions from './SortOptions';
import FilterOptions from './FilterOptions';

import { Container } from './elements';

export default ({ possibleTemplates, hideOrder }) => (
  <Container>
    <FilterOptions possibleTemplates={possibleTemplates} />
    <SortOptions hideOrder={hideOrder} />
  </Container>
);
