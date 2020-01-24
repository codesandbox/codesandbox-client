import React from 'react';
import { Collapsible, Text, Element } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { Tasks } from './Tasks';
import { Status } from './Status';
import { Ports } from './Ports';

export const Server = () => {
  const {
    // actions: {
    //   server: { restartContainer, restartSandbox },
    // },
    state: {
      server,
      editor: { parsedConfigurations },
    },
  } = useOvermind();
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
          <Status
            managerStatus={server.status}
            containerStatus={server.containerStatus}
          />
        </Element>
      </Element>
      <Collapsible title="Run Script" defaultOpen>
        <Tasks package={parsedConfigurations?.package?.parsed} />
      </Collapsible>
      <Ports />
    </Collapsible>
  );
};
