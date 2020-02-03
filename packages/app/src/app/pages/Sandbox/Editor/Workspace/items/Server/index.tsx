import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Description, WorkspaceInputContainer } from '../../elements';

import { ControlContainer } from './ControlContainer';
import { SubTitle, TasksContainer } from './elements';
import { OpenPorts } from './OpenPorts';
import { SecretKeys } from './SecretKeys';
import { Status } from './Status';
import { Tasks } from './Tasks';

export const Server: FunctionComponent = () => {
  const {
    state: {
      editor: { parsedConfigurations },
      server,
    },
  } = useOvermind();
  const disconnected = server.status !== 'connected';

  return (
    <div>
      <Description>
        This sandbox is executed on a server. You can control the server from
        this panel.
      </Description>

      <Margin top={1}>
        <SubTitle>Status</SubTitle>

        <WorkspaceInputContainer>
          <Status
            managerStatus={server.status}
            containerStatus={server.containerStatus}
          />
        </WorkspaceInputContainer>
      </Margin>

      <Margin top={1.5}>
        <SubTitle>Run Scripts</SubTitle>
        <Margin top={0.5}>
          <TasksContainer disconnected={disconnected}>
            <Tasks package={parsedConfigurations?.package?.parsed} />
          </TasksContainer>
        </Margin>
      </Margin>

      <OpenPorts />

      <ControlContainer />

      <SecretKeys />
    </div>
  );
};
