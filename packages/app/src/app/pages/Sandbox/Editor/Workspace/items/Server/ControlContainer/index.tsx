import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { WorkspaceInputContainer } from '../../../elements';

import { ActionButton, PowerIcon, SubTitle } from './elements';

export const ControlContainer: FunctionComponent = () => {
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
    <Margin top={1} bottom={0.5}>
      <SubTitle>Control Container</SubTitle>

      <WorkspaceInputContainer>
        <ActionButton
          disabled={disconnected || containerStatus !== 'sandbox-started'}
          onClick={() => restartSandbox()}
        >
          <>
            <PowerIcon /> Restart Sandbox
          </>
        </ActionButton>
      </WorkspaceInputContainer>

      <WorkspaceInputContainer>
        <ActionButton
          disabled={disconnected || containerStatus === 'initializing'}
          onClick={() => restartContainer()}
        >
          <>
            <PowerIcon /> Restart Server
          </>
        </ActionButton>
      </WorkspaceInputContainer>
    </Margin>
  );
};
