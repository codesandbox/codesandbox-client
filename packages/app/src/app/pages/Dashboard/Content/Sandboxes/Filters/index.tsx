import React, { ComponentProps, FunctionComponent } from 'react';

import { SortOptions } from './SortOptions';
import { FilterOptions } from './FilterOptions';

import { Container } from './elements';

type Props = {
  hideOrder?: boolean;
} & Pick<
  ComponentProps<typeof FilterOptions>,
  'hideFilters' | 'possibleTemplates'
>;
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
