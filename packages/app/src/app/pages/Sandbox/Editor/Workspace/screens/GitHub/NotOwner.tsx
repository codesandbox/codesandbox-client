import {
  Button,
  Collapsible,
  Element,
  Stack,
  Text,
} from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import React from 'react';

export const NotOwner = () => {
  const { isForkingSandbox } = useAppState().editor;
  const { forkSandboxClicked } = useActions().editor;

  return (
    <Collapsible title="GitHub" defaultOpen>
      <Element paddingX={2}>
        <Stack direction="vertical" gap={2} marginBottom={6}>
          <Text size={2} variant="muted" block>
            You need to own this sandbox to export this sandbox to GitHub and
            make commits and pull requests to it.
          </Text>
          <Text size={2} variant="muted" block>
            Make a fork to own the sandbox.
          </Text>
        </Stack>
        <Button
          variant="primary"
          disabled={isForkingSandbox}
          onClick={() => forkSandboxClicked({})}
        >
          {isForkingSandbox ? 'Forking Sandbox...' : 'Fork Sandbox'}
        </Button>
      </Element>
    </Collapsible>
  );
};
