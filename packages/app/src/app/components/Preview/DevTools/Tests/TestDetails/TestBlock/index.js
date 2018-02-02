// @flow
import React from 'react';
import type { Test } from '../../';

import { BlockHeader, Container, Actions } from './elements';
import TestName from './TestName';
import ErrorDetails from '../ErrorDetails';

type Props = {
  test: Test,
  path: string,
};

export default ({ test, path }: Props) => (
  <Container>
    <BlockHeader>
      <TestName test={test} />
      <Actions>{test.duration != null ? `${test.duration}ms` : ''}</Actions>
    </BlockHeader>
    {test.errors &&
      test.errors.length !== 0 &&
      test.errors.map(error => (
        <ErrorDetails error={error} path={path} key={error.message} />
      ))}
  </Container>
);
