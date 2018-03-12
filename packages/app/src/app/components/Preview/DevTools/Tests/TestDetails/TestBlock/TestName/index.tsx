import * as React from 'react';

import { StatusElements } from '../../../elements';
import { Block, TestNameWrapper } from './elements';
import { Test } from 'app/components/Preview/DevTools/Tests/types'

type Props = {
  test: Test
};

const TestName: React.SFC<Props> = ({ test }) => {
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
      <TestNameWrapper>{testName}</TestNameWrapper>
    </div>
  );
};

export default TestName
