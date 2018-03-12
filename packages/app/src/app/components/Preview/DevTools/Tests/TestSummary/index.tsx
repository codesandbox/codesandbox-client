import * as React from 'react';
import PlayIcon from 'react-icons/lib/go/playback-play';
import SyncIcon from 'react-icons/lib/go/sync';

import Tooltip from 'common/components/Tooltip';

import { File, Test, Status } from 'app/components/Preview/DevTools/Tests/types'

import {
  Container,
  Title,
  Progress,
  SuccessBar,
  FailBar,
  TestData,
  IdleBar,
  Actions,
} from './elements';

import TestSummaryText from '../TestSummaryText';

type Props = {
  files: { [path: string]: File },
  fileStatuses: { [path: string]: Status },
  running: boolean,
  watching: boolean,
  toggleWatching: Function,
  runAllTests: Function,
  tests: Array<Test>,
};

const TestSummary: React.SFC<Props> =  ({
  files,
  running,
  fileStatuses,
  watching,
  toggleWatching,
  runAllTests,
  tests,
}) => {
  const totalDuration = tests.reduce((p, n) => p + (n.duration || 0), 0);

  const fileTestSuccessCount = Object.keys(fileStatuses).filter(
    f => fileStatuses[f] === 'pass'
  ).length;
  const fileTestFailCount = Object.keys(fileStatuses).filter(
    f => fileStatuses[f] === 'fail'
  ).length;
  const fileTestIdleCount = Object.keys(fileStatuses).filter(
    f => fileStatuses[f] === 'idle' || fileStatuses[f] === 'running'
  ).length;
  const totalTestCount = Object.keys(files).length;

  return (
    <div>
      <Container>
        <Title>
          {running ? 'Running Test Suites...' : 'Test Suites'}
          <TestData>
            <TestSummaryText
              failedCount={fileTestFailCount}
              passedCount={fileTestSuccessCount}
              totalCount={totalTestCount}
            />
          </TestData>
          <Actions>
            <div style={{ fontSize: '.875rem' }}>
              {totalTestCount !== 0 && `${totalDuration}ms`}
            </div>
            <Tooltip title="Toggle File Watching">
              <SyncIcon
                style={{ color: watching ? 'white' : 'inherit' }}
                onClick={toggleWatching}
              />
            </Tooltip>
            <Tooltip title="Run All Tests">
              <PlayIcon onClick={runAllTests} />
            </Tooltip>
          </Actions>
        </Title>
      </Container>
      <Progress>
        <FailBar count={fileTestFailCount} />
        <SuccessBar count={fileTestSuccessCount} />
        <IdleBar count={fileTestIdleCount} />
      </Progress>
    </div>
  );
};

export default TestSummary
