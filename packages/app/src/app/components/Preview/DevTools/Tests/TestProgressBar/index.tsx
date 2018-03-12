import * as React from 'react';
import { ProgressBar, FailedBar, SuccessBar, IdleBar } from './elements';

type Props = {
  failedCount: number,
  passedCount: number,
  idleCount: number,
};

const TestProgressBar: React.SFC<Props> = ({ failedCount, passedCount, idleCount }) => (
  <ProgressBar>
    <FailedBar count={failedCount} />
    <SuccessBar count={passedCount} />
    <IdleBar count={idleCount} />
  </ProgressBar>
);

export default TestProgressBar
