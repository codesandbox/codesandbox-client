import * as React from 'react';
import { Test } from '../../..';

import { StatusElements } from '../../../elements';
import { Block, TestName as Name } from './elements';

type Props = {
  test: Test;
};

export const TestName = ({ test }: Props) => {
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
      <Name>{testName}</Name>
    </div>
  );
};
