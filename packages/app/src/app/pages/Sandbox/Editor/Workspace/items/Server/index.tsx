import React, { FunctionComponent } from 'react';

import { Description } from '../../elements';

import { ControlContainer } from './ControlContainer';
import { OpenPorts } from './OpenPorts';
import { RunScripts } from './RunScripts';
import { SecretKeys } from './SecretKeys';
import { Status } from './Status';

export const Server: FunctionComponent = () => (
  <div>
    <Description>
      This sandbox is executed on a server. You can control the server from this
      panel.
    </Description>

    <Status />

    <RunScripts />

    <OpenPorts />

    <ControlContainer />

    <SecretKeys />
  </div>
);
