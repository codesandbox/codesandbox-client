import React, { ComponentProps, FunctionComponent } from 'react';

import { FilterOptions } from './FilterOptions';
import { SortOptions } from './SortOptions';

import { Container } from './elements';

type Props = Pick<
  ComponentProps<typeof FilterOptions>,
  'hideFilters' | 'possibleTemplates'
> &
  Partial<Pick<ComponentProps<typeof SortOptions>, 'hideOrder'>>;
export const Filters: FunctionComponent<Props> = ({
  hideFilters,
  hideOrder,
  possibleTemplates,
}) => (
  <Container>
    <FilterOptions
      hideFilters={hideFilters}
      possibleTemplates={possibleTemplates}
    />

    <SortOptions hideOrder={hideOrder} />
  </Container>
);
