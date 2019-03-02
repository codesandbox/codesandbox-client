import React from 'react';

import { Hits, Pagination } from 'react-instantsearch/dom';
import Centered from 'common/lib/components/flex/Centered';

import ResultInfo from '../ResultInfo';
import SandboxCard from '../SandboxCard';

import { Container } from './elements';

function Results() {
  return (
    <Container>
      <ResultInfo />
      <Hits hitComponent={SandboxCard} />
      <Centered horizontal>
        <Pagination />
      </Centered>
    </Container>
  );
}

export default Results;
