import React from 'react';
import { Collapsible, Text, Element } from '@codesandbox/components';
import { Tasks } from './Tasks';
import { Status } from './Status';
import { Ports } from './Ports';
import { Control } from './Control';

export const Server = () => (
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
        <Status />
      </Element>
    </Element>
    <Tasks />
    <Ports />
    <Control />
  </Collapsible>
);
