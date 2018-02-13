// @flow

import React from 'react';

import type { Test } from '../';

import { Container, HappyMessage, Item, Tests, ItemTitle } from './elements';

import TestSummaryText from '../TestSummaryText';
import TestProgressBar from '../TestProgressBar';
import TestBlock from '../TestDetails/TestBlock';

type Props = {
  tests: Array<Test>,
  openFile: (path: string) => void,
};

export default ({ tests, openFile }: Props) => {
  const failedTests = tests.filter(t => t.status === 'fail');

  const testPassCount = tests.filter(t => t.status === 'pass').length;
  const testFailCount = failedTests.length;
  const testIdleCount = tests.filter(
    t => t.status === 'idle' || t.status === 'running'
  ).length;
  const totalTestCount = tests.length;
  return (
    <Container>
      <Item>
        <ItemTitle>Test Summary</ItemTitle>
        <TestSummaryText
          passedCount={testPassCount}
          failedCount={testFailCount}
          totalCount={totalTestCount}
        />
      </Item>
      <TestProgressBar
        passedCount={testPassCount}
        failedCount={testFailCount}
        idleCount={testIdleCount}
      />

      <Tests>
        {failedTests.length > 0
          ? failedTests.map(t => (
              <TestBlock
                openFile={() => openFile(t.path)}
                key={t.testName.join('-')}
                test={t}
              />
            ))
          : totalTestCount > 0 && (
              <HappyMessage>
                There are no failing tests, congratulations!
              </HappyMessage>
            )}
      </Tests>
    </Container>
  );
};
