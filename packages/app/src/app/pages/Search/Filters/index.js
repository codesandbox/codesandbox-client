import React from 'react';

import Filter from './Filter';
import { Container } from './elements';

function Filters() {
  return (
    <Container>
      <Filter
        title="Templates"
        operator="or"
        attributeName="template"
        noSearch
      />
      <Filter
        title="Dependencies"
        operator="and"
        attributeName="npm_dependencies.dependency"
      />
      <Filter title="Tags" operator="or" attributeName="tags" />
    </Container>
  );
}

export default Filters;
