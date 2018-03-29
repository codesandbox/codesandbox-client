import * as React from 'react';

import { Hits, Pagination } from 'react-instantsearch/dom';
import Centered from 'common/components/flex/Centered';

import ResultInfo from '../ResultInfo';
import SandboxCard from '../SandboxCard';

import { Container } from './elements';

const Results: React.SFC<{}> = () => {
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
