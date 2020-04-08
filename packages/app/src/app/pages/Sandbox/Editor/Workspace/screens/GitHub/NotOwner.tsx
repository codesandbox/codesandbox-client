import {
  Button,
  Collapsible,
  Element,
  Stack,
  Text,
} from '@codesandbox/components';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

export const NotOwner: FunctionComponent = () => {
  const {
    actions: {
      editor: { forkSandboxClicked },
    },
    state: {
      editor: { isForkingSandbox },
    },
  } = useOvermind();

  return (
    <Collapsible defaultOpen title="Github">
      <Element paddingX={2}>
        <Stack direction="vertical" gap={2} marginBottom={6}>
          <Text block size={2} variant="muted">
            You need to own this sandbox to export this sandbox to GitHub and
            make commits and pull requests to it.
          </Text>

          <Text size={2} variant="muted" block>
            Make a fork to own the sandbox.
          </Text>
        </Stack>

        <Button
          disabled={isForkingSandbox}
          onClick={forkSandboxClicked}
          variant="primary"
        >
          {isForkingSandbox ? 'Forking Sandbox...' : 'Fork Sandbox'}
        </Button>
      </Element>
    </Collapsible>
  );
};
