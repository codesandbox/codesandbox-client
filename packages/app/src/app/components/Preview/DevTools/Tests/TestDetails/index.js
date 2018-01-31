// @flow
import React from 'react';
import type { File, Status } from '../';

import {
  PassedTests,
  FailedTests,
  TotalTests,
  TestName,
  TestDetails,
  TestTitle,
  Blocks,
  RightSide,
  ProgressBar,
  SuccessBar,
  FailedBar,
  IdleBar,
  Tests,
} from './elements';
import { StatusElements } from '../elements';

import TestBlock from './TestBlock';

type Props = {
  file: ?File,
  status: Status,
};

const niceStatus = (status: Status) => {
  switch (status) {
    case 'fail': {
      return 'Failed';
    }
    case 'pass': {
      return 'Success';
    }
    case 'idle': {
      return 'Waiting...';
    }
    case 'running': {
      return 'Running';
    }
    default: {
      return 'Unknown Status';
    }
  }
};

export default ({ file, status }: Props) => {
  if (file == null) {
    return <div>No file has been selected</div>;
  }

  const parts = file.fileName.split('/');
  const title = parts.pop();

  const Element = StatusElements[status];

  const passedCount = Object.keys(file.tests).filter(
    // $FlowIssue
    f => file.tests[f].status === 'pass'
  ).length;
  const failedCount = Object.keys(file.tests).filter(
    // $FlowIssue
    f => file.tests[f].status === 'fail'
  ).length;
  const idleCount = Object.keys(file.tests).filter(
    // $FlowIssue
    f => file.tests[f].status === 'idle'
  ).length;
  const totalCount = Object.keys(file.tests).length;

  const totalDuration = Object.keys(file.tests).reduce(
    // $FlowIssue
    (prev, next) => prev + file.tests[next].duration || 0,
    0
  );

  return (
    <div>
      <TestTitle>
        <Element />
        <Blocks>{parts.join('/')}/</Blocks>
        <TestName>{title}</TestName>
        <TestDetails>
          <PassedTests>{passedCount} passed</PassedTests>
          <FailedTests>{failedCount} failed</FailedTests>
          <TotalTests>{totalCount} total</TotalTests>
          <RightSide>
            <TotalTests>duration: {totalDuration}ms</TotalTests>
          </RightSide>
        </TestDetails>
      </TestTitle>
      <ProgressBar>
        <SuccessBar count={passedCount} />
        <FailedBar count={failedCount} />
        <IdleBar count={idleCount} />
      </ProgressBar>

      <Tests style={{ overflowY: 'auto' }}>
        {Object.keys(file.tests).map(tName => {
          // $FlowIssue
          const test = file.tests[tName];

          return <TestBlock key={tName} test={test} />;
        })}
      </Tests>
    </div>
  );
};
