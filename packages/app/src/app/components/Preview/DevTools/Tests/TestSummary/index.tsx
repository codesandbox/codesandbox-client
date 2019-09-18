import * as React from 'react';
import PlayIcon from 'react-icons/lib/go/playback-play';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';

import { File, Test, Status } from '..';

import {
  Container,
  Title,
  Progress,
  SuccessBar,
  FailBar,
  TestData,
  IdleBar,
  Actions,
  SyncIconStyled,
} from './elements';

import { TestSummaryText } from '../TestSummaryText';

type Props = {
  files: { [path: string]: File };
  fileStatuses: { [path: string]: Status };
  running: boolean;
  watching: boolean;
  toggleWatching: (e: React.MouseEvent<React.ReactSVGElement>) => void;
  runAllTests: (e: React.MouseEvent<React.ReactSVGElement>) => void;
  tests: Array<Test>;
};

export const TestSummary = ({
  files,
  running,
  fileStatuses,
  watching,
  toggleWatching,
  runAllTests,
  tests,
}: Props) => {
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
            <Tooltip content="Toggle File Watching">
              <SyncIconStyled watching={watching} onClick={toggleWatching} />
            </Tooltip>
            <Tooltip content="Run All Tests">
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
