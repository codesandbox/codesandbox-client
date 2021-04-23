import React, { FunctionComponent } from 'react';

import { Button, Stack } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import css from '@styled-system/css';
import { Alert } from '../Common/Alert';

export const RecoverFilesModal: FunctionComponent = () => {
  const { files, modalClosed } = useActions();
  const { recoveredFiles } = useAppState().editor;

  return (
    <Alert
      title="Recovered Files"
      description={`We recovered ${recoveredFiles.length} unsaved ${
        recoveredFiles.length > 1 ? 'files' : 'file'
      } from a previous session, what do you want to do?`}
    >
      <Stack justify="flex-end" gap={2}>
        <Button
          variant="secondary"
          css={css({
            width: 'auto',
          })}
          onClick={() => {
            files.applyRecover(recoveredFiles);
            modalClosed();
          }}
        >
          Apply Changes
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            files.createRecoverDiffs(recoveredFiles);
            modalClosed();
          }}
          type="submit"
          css={css({
            width: 'auto',
          })}
        >
          Compare
        </Button>
        <Button
          onClick={() => {
            files.discardRecover();
            modalClosed();
          }}
          type="submit"
          css={css({
            width: 'auto',
          })}
        >
          Discard
        </Button>
      </Stack>
    </Alert>
  );
};
