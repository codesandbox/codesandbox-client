// @flow
import React from 'react';
import type { Test } from '../../../';

import { StatusElements } from '../../../elements';
import { Block, TestName, Container, Part } from './elements';

type Props = {
  test: Test,
};

export default ({ test }: Props) => {
  const StatusElement = StatusElements[test.status];

  const testParts = [...test.testName];
  const testName = testParts.pop();

  return (
    <Container>
      <StatusElement />
      {testParts.map((part, i) => (
        <Block last={i === testParts.length - 1} key={part}>
          <Part>{part}</Part>
        </Block>
      ))}
      <TestName>{testName}</TestName>
    </Container>
  );
};
