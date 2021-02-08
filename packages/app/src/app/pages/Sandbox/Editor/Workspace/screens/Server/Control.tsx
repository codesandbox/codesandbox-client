import {
  Button,
  Collapsible,
  Element,
  Stack,
  Text,
} from '@codesandbox/components';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { RestartServerIcon } from './Icons';

export const Control: FunctionComponent = () => {
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
          disabled={disconnected || containerStatus !== 'sandbox-started'}
          onClick={restartSandbox}
          variant="secondary"
        >
          <Stack align="center" gap={2}>
            <RestartServerIcon /> <Text>Restart Sandbox</Text>
          </Stack>
        </Button>

        <Button
          disabled={disconnected || containerStatus === 'initializing'}
          marginTop={2}
          onClick={restartContainer}
          variant="secondary"
        >
          <Stack align="center" gap={2}>
            <RestartServerIcon /> <Text>Restart Server</Text>
          </Stack>
        </Button>
      </Element>
    </Collapsible>
  );
};
