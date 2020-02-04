import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Description, WorkspaceInputContainer } from '../../elements';

import { ControlContainer } from './ControlContainer';
import { SubTitle } from './elements';
import { OpenPorts } from './OpenPorts';
import { RunScripts } from './RunScripts';
import { SecretKeys } from './SecretKeys';
import { Status } from './Status';

export const Server: FunctionComponent = () => {
  const {
    state: { server },
  } = useOvermind();

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

      <RunScripts />

      <OpenPorts />

      <ControlContainer />

      <SecretKeys />
    </div>
  );
};
