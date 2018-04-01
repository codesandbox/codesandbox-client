// @flow
import React from 'react';
import type { Test } from '../../../';

import { StatusElements } from '../../../elements';
import { Block, TestName } from './elements';

type Props = {
  test: Test,
};

export default ({ test }: Props) => {
  const StatusElement = StatusElements[test.status];

  const testParts = [...test.testName];
  const testName = testParts.pop();

  return (
    <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
      <StatusElement />
      {testParts.map((part, i) => (
        <Block last={i === testParts.length - 1} key={part}>
          <span style={{ zIndex: 10 }}>{part}</span>
        </Block>
      ))}
      <TestName>{testName}</TestName>
    </div>
  );
};
