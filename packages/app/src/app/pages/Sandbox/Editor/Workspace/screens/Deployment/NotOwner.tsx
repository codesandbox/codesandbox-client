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
    <Collapsible title="Deployment" defaultOpen>
      <Element css={css({ paddingX: 2 })}>
        <Stack direction="vertical" gap={2} marginBottom={6}>
          <Text size={2} variant="muted" block>
            You can deploy a production version of your sandbox using one of our
            supported providers - Netlify or ZEIT.
          </Text>
          <Text size={2} variant="muted" block>
            You need to own this sandbox to deploy.
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
