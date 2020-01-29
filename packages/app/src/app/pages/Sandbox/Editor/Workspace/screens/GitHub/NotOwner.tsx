import React from 'react';
import css from '@styled-system/css';

import {
  Element,
  Collapsible,
  Stack,
  Text,
  Button,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';

export const NotOwner = () => {
  const {
    actions: {
      editor: { forkSandboxClicked },
    },
    state: {
      editor: { isForkingSandbox },
    },
  } = useOvermind();

  return (
    <Collapsible title="Github" defaultOpen>
      <Element css={css({ paddingX: 2 })}>
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
          onClick={() => forkSandboxClicked()}
        >
          {isForkingSandbox ? 'Forking Sandbox...' : 'Fork Sandbox'}
        </Button>
      </Element>
    </Collapsible>
  );
};
