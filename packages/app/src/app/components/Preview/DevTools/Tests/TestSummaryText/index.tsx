import * as React from 'react';
import {
  TestDetails,
  FailedTests,
  PassedTests,
  TotalTests,
  RightSide,
} from './elements';

type Props = {
  failedCount: number;
  passedCount: number;
  totalCount: number;
  totalDuration?: number;
};

export const TestSummaryText = ({
  failedCount,
  passedCount,
  totalCount,
  totalDuration,
}: Props) => (
  <TestDetails>
    {failedCount !== 0 && <FailedTests>{failedCount} failed</FailedTests>}
    {passedCount !== 0 && <PassedTests>{passedCount} passed</PassedTests>}
    {totalCount !== 0 && <TotalTests>{totalCount} total</TotalTests>}
    {totalDuration != null && (
      <RightSide>
        <TotalTests>{totalDuration}ms</TotalTests>
      </RightSide>
    )}
  </TestDetails>
);
