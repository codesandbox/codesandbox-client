import React from 'react';
import {
  Collapsible,
  Text,
  Element,
  Button,
  Stack,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { RestartServerIcon } from './Icons';

export const Control = () => {
  const {
    actions: {
      server: { restartContainer, restartSandbox },
    },
    state: {
      server: { containerStatus, status },
    },
  } = useOvermind();
  const disconnected = status !== 'connected';

  return (
    <Collapsible defaultOpen title="Control Container">
      <Element paddingX={2}>
        <Button
          variant="secondary"
          disabled={disconnected || containerStatus !== 'sandbox-started'}
          onClick={restartSandbox}
        >
          <Stack gap={2} align="center">
            <RestartServerIcon /> <Text>Restart Sandbox</Text>
          </Stack>
        </Button>
        <Button
          marginTop={2}
          variant="secondary"
          disabled={disconnected || containerStatus === 'initializing'}
          onClick={restartContainer}
        >
          <Stack gap={2} align="center">
            <RestartServerIcon /> <Text>Restart Server</Text>
          </Stack>
        </Button>
      </Element>
    </Collapsible>
  );
};
