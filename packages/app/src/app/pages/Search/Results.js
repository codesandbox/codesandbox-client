import React from 'react';
import styled from 'styled-components';

import { Hits, Pagination } from 'react-instantsearch/dom';
import Centered from 'common/components/flex/Centered';

import ResultInfo from './ResultInfo';
import SandboxCard from './SandboxCard';

const Container = styled.div`
  flex: 2;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-right: 2rem;
  padding-top: 1rem;

  color: rgba(255, 255, 255, 0.6);
`;

export default () => (
  <Container>
    <ResultInfo />
    <Hits hitComponent={SandboxCard} />
    <Centered horizontal>
      <Pagination />
    </Centered>
  </Container>
);
