import React, { FunctionComponent } from 'react';

import { Button, Link, Stack } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import css from '@styled-system/css';
import { Alert } from '../Common/Alert';

export const LiveSessionEnded: FunctionComponent = () => {
  const {
    currentModalMessage,
    editor: { currentSandbox },
  } = useAppState();
  const {
    editor: { forkSandboxClicked },
    modalClosed,
  } = useActions();
  if (!currentSandbox) {
    return null;
  }
  const { owned } = currentSandbox;

  const suggestion = owned
    ? 'you can continue working on the current sandbox.'
    : 'you can continue working by forking the sandbox or by creating a new sandbox.';

  return (
    <Alert
      title="The live session has ended"
      description={`${
        currentModalMessage || 'The session has ended due to inactivity'
      }, ${suggestion}`}
    >
      <Stack gap={2} align="center" justify="flex-end">
        {owned ? (
          <Button
            css={css({
              width: 'auto',
            })}
            variant="link"
            onClick={modalClosed}
          >
            Close Modal
          </Button>
        ) : (
          <Button
            css={css({
              width: 'auto',
            })}
            onClick={() => {
              forkSandboxClicked({});
              modalClosed();
            }}
            variant="link"
          >
            Fork Sandbox
          </Button>
        )}
        <Link
          href="/s"
          css={css({
            width: 'auto',
            textDecoration: 'none',
          })}
          onClick={modalClosed}
        >
          Create Sandbox
        </Link>
      </Stack>
    </Alert>
  );
};
