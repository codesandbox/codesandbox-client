import {
  Button,
  Collapsible,
  Element,
  Stack,
  Text,
} from '@codesandbox/components';
import React, { FunctionComponent } from 'react';
import { useAppState, useActions } from 'app/overmind';

export const NotOwner: FunctionComponent = () => {
  const { forkSandboxClicked } = useActions().editor;
  const { isForkingSandbox } = useAppState().editor;

  return (
    <Collapsible defaultOpen title="Deployment">
      <Element paddingX={2}>
        <Stack direction="vertical" gap={2} marginBottom={6}>
          <Text block size={2} variant="muted">
            You can deploy a production version of your sandbox using one of our
            supported providers - Netlify or Vercel.
          </Text>

          <Text block size={2} variant="muted">
            You need to own this sandbox to deploy.
          </Text>
        </Stack>

        <Button
          disabled={isForkingSandbox}
          onClick={() => forkSandboxClicked({})}
          variant="primary"
        >
          {isForkingSandbox ? 'Forking Sandbox...' : 'Fork Sandbox'}
        </Button>
      </Element>
    </Collapsible>
  );
};
