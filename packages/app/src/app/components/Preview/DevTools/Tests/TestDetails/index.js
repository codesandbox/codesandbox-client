// @flow
import React from 'react';
import FileIcon from 'react-icons/lib/md/insert-drive-file';
import PlayIcon from 'react-icons/lib/go/playback-play';

import Tooltip from 'common/components/Tooltip';
import type { File, Status } from '../';

import {
  Action,
  TestName,
  TestTitle,
  Blocks,
  Tests,
  ErrorNotice,
} from './elements';
import { StatusElements } from '../elements';

import TestBlock from './TestBlock';
import ErrorDetails from './ErrorDetails';
import TestSummaryText from '../TestSummaryText';
import TestProgressBar from '../TestProgressBar';

type Props = {
  file: File,
  status: Status,
  openFile: (path: string) => void,
  runTests: (file: File) => void,
};

export default ({ file, status, openFile, runTests }: Props) => {
  if (file == null) {
    return <div>No file has been selected</div>;
  }

  const parts = file.fileName.split('/');
  const title = parts.pop();

  const Element = StatusElements[status];

  const passedCount = Object.keys(file.tests).filter(
    f => file.tests[f].status === 'pass'
  ).length;
  const failedCount = Object.keys(file.tests).filter(
    f => file.tests[f].status === 'fail'
  ).length;
  const idleCount = Object.keys(file.tests).filter(
    f => file.tests[f].status === 'idle'
  ).length;
  const totalCount = Object.keys(file.tests).length;

  const totalDuration = Object.keys(file.tests).reduce(
    (prev, next) => prev + file.tests[next].duration || 0,
    0
  );

  return (
    <div style={{ height: '100%' }}>
      <TestTitle>
        <Element />
        <Blocks>{parts.join('/')}/</Blocks>
        <TestName>{title}</TestName>
        {!file.fileError && (
          <TestSummaryText
            failedCount={failedCount}
            passedCount={passedCount}
            totalCount={totalCount}
            totalDuration={totalDuration}
          />
        )}
        <Action>
          <Tooltip title="Open File">
            <FileIcon onClick={() => openFile(file.fileName)} />
          </Tooltip>
        </Action>
        <Action>
          <Tooltip title="Run Tests">
            <PlayIcon onClick={() => runTests(file)} />
          </Tooltip>
        </Action>
      </TestTitle>

      <TestProgressBar
        failedCount={failedCount}
        passedCount={passedCount}
        idleCount={idleCount}
      />

      <Tests>
        {file.fileError ? (
          <ErrorNotice>
            <div style={{ marginBottom: '1rem' }}>
              There was an error while evaluating the file:
            </div>
            <ErrorDetails path={file.fileName} error={file.fileError} />
          </ErrorNotice>
        ) : (
          Object.keys(file.tests).map(tName => {
            const test = file.tests[tName];

            return <TestBlock key={tName} test={test} />;
          })
        )}
      </Tests>
    </div>
  );
};
