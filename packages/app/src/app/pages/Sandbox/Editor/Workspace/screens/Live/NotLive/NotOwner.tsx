import { Button, Stack, Text } from '@codesandbox/components';
import React, { FunctionComponent } from 'react';
import { useAppState, useActions } from 'app/overmind';

export const NotOwner: FunctionComponent = () => {
  const { forkSandboxClicked } = useActions().editor;
  const { isForkingSandbox } = useAppState().editor;

  return (
    <>
      <Stack direction="vertical" gap={2} marginBottom={6}>
        <Text block size={2} variant="muted">
          You need to own this sandbox to open a live session to collaborate
          with others in real time.
        </Text>

        <Text block size={2} variant="muted">
          Fork this sandbox to share it with others!
        </Text>
      </Stack>

      <Button
        disabled={isForkingSandbox}
        onClick={() => forkSandboxClicked({})}
        variant="primary"
      >
        Fork Sandbox
      </Button>
    </>
  );
};
