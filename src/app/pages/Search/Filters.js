import React from 'react';
import styled from 'styled-components';

import { RefinementList } from 'react-instantsearch/dom';

const Container = styled.div`flex: 1;`;

export default () =>
  <Container>
    <RefinementList
      withSearchBox
      showMore
      operator="and"
      attributeName="npm_dependencies.dependency"
    />
  </Container>;
