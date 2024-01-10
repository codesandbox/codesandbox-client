import React, { FunctionComponent } from 'react';
import { Collapsible, Element } from '@codesandbox/components';
import { Control } from './Control';
import { EnvVars } from './EnvVars';
import { Ports } from './Ports';
import { Status } from './Status';
import { Tasks } from './Tasks';

export const Server: FunctionComponent = () => (
  <>
    <Collapsible defaultOpen title="Server Control Panel">
      <Element marginBottom={5} paddingY={2} paddingX={1}>
        <Status />
      </Element>
    </Collapsible>
    <Tasks />
    <Ports />
    <Control />
    <EnvVars />
  </>
);
