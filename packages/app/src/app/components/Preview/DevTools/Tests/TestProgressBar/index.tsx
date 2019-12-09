import * as React from 'react';
import { ProgressBar, FailedBar, SuccessBar, IdleBar } from './elements';

type Props = {
  failedCount: number;
  passedCount: number;
  idleCount: number;
};

export const TestProgressBar = ({
  failedCount,
  passedCount,
  idleCount,
}: Props) => (
  <ProgressBar>
    <FailedBar count={failedCount} />
    <SuccessBar count={passedCount} />
    <IdleBar count={idleCount} />
  </ProgressBar>
);
