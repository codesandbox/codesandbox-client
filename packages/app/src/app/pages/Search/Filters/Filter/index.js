import React from 'react';

import { RefinementList } from 'react-instantsearch/dom';

import { Container, Title } from './elements';

function Filter({ title, attributeName, operator, noSearch }) {
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
