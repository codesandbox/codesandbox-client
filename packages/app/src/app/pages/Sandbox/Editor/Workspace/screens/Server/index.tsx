import React from 'react';
import {
  Collapsible,
  Text,
  Element,
  Button,
  Stack,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { Tasks } from './Tasks';
import { Status } from './Status';
import { Ports } from './Ports';

const RestartServerIcon = props => (
  <svg width={12} height={11} fill="none" viewBox="0 0 12 11" {...props}>
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M6.458 9.041a3.875 3.875 0 10-3.832-4.448h1.249L1.937 7.176l-.44-.588-.005.006a4.659 4.659 0 01-.006-.02L0 4.593h1.323a5.167 5.167 0 111.85 4.562l.92-.92a3.858 3.858 0 002.365.806z"
      clipRule="evenodd"
    />
    <path
      fill="#fff"
      d="M8.22 4.934a.23.23 0 01-.012.381L5.85 6.782a.23.23 0 01-.35-.194V3.444a.23.23 0 01.362-.187l2.357 1.677z"
    />
  </svg>
);

export const Server = () => {
  const {
    actions: {
      server: { restartContainer, restartSandbox },
    },
    state: {
      server: { containerStatus, status },
      editor: { parsedConfigurations },
    },
  } = useOvermind();
  const disconnected = status !== 'connected';
  return (
    <Collapsible defaultOpen title="Server Control Panel">
      <Element padding={2} marginBottom={5}>
        <Text weight="medium" block marginBottom={2}>
          Server Sandbox
        </Text>
        <Text variant="muted">
          This sandbox is executed on a server. You can control the server from
          this panel.
        </Text>
        <Element marginTop={5}>
          <Status managerStatus={status} containerStatus={containerStatus} />
        </Element>
      </Element>
      <Collapsible title="Run Script" defaultOpen>
        <Tasks package={parsedConfigurations?.package?.parsed} />
      </Collapsible>
      <Ports />
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
    </Collapsible>
  );
};
