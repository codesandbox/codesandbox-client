import Tooltip from '@codesandbox/common/es/components/Tooltip';
import * as React from 'react';
import { MdInsertDriveFile } from 'react-icons/md';

import { Test } from '../..';
import { ErrorDetails } from '../ErrorDetails';
import { Actions, BlockHeader, Container } from './elements';
import { TestName } from './TestName';

type Props = {
  test: Test;
  openFile?: (path: string) => void;
};

export const TestBlock = ({ test, openFile }: Props) => (
  <Container>
    <BlockHeader>
      <TestName test={test} />
      <Actions>
        {openFile && (
          <Tooltip content="Open File">
            <MdInsertDriveFile onClick={() => openFile(test.path)} />
          </Tooltip>
        )}
        <div>{test.duration != null ? `${test.duration}ms` : ''}</div>
      </Actions>
    </BlockHeader>
    {test.errors &&
      test.errors.length !== 0 &&
      test.errors.map(error => (
        <ErrorDetails error={error} path={test.path} key={error.message} />
      ))}
  </Container>
);
