import * as React from 'react';

import { RefinementList } from 'react-instantsearch/dom';

import { Container, Title } from './elements';

type Props = {
  title: string
  attributeName: string
  operator: string
  noSearch?: boolean
}

const Filter: React.SFC<Props> = ({ title, attributeName, operator, noSearch }) => {
  return (
    <Container>
      <Title>{title}</Title>
      <RefinementList
        withSearchBox={!noSearch}
        showMore={!noSearch}
        operator={operator}
        attributeName={attributeName}
      />
    </Container>
  );
}

export default Filter;
