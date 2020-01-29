import React from 'react';
import { Collapsible, Text, Element } from '@codesandbox/components';
import { Tasks } from './Tasks';
import { Status } from './Status';
import { Ports } from './Ports';
import { Control } from './Control';
import { EnvVars } from './EnvVars';

export const Server = () => (
  <Collapsible defaultOpen title="Server Control Panel">
    <Element padding={2} marginBottom={5}>
      <Text weight="medium" block marginBottom={2}>
        Server Sandbox
      </Text>
      <Text variant="muted" block marginBottom={5}>
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
