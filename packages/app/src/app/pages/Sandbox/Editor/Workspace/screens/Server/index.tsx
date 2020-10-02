import { Collapsible, Element, Text } from '@codesandbox/components';
import React, { FunctionComponent } from 'react';

import { Control } from './Control';
import { EnvVars } from './EnvVars';
import { Ports } from './Ports';
import { Status } from './Status';
import { Tasks } from './Tasks';

export const Server: FunctionComponent = () => (
  <Collapsible defaultOpen title="Server Control Panel">
    <Element marginBottom={5} padding={2}>
      <Text block marginBottom={2} weight="medium">
        Server Sandbox
      </Text>

      <Text block marginBottom={5} variant="muted">
        This sandbox is executed on a server. You can control the server from
        this panel.
      </Text>

      <Status />
    </Element>

    <Tasks />

    <Ports />

    <Control />

    <EnvVars />
  </Collapsible>
);
