import * as React from 'react';
import FileIcon from 'react-icons/lib/md/insert-drive-file';

import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import { Test } from '../..';

import { BlockHeader, Container, Actions } from './elements';
import { TestName } from './TestName';
import { ErrorDetails } from '../ErrorDetails';

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
            <FileIcon onClick={() => openFile(test.path)} />
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
