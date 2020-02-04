import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { WorkspaceInputContainer } from '../../../elements';

import { SubTitle } from '../elements';

import { Container, StatusCircle } from './elements';
import { getContainerStatusInfo, getManagerStatusInfo } from './getStatusInfo';

export const Status: FunctionComponent = () => {
  const {
    state: {
      server: { containerStatus, status },
    },
  } = useOvermind();
  const { color, message } =
    getManagerStatusInfo(status) || getContainerStatusInfo(containerStatus);

  return (
    <Margin top={1}>
      <SubTitle>Status</SubTitle>

      <WorkspaceInputContainer>
        <Container>
          <StatusCircle color={color} />

          {message}
        </Container>
      </WorkspaceInputContainer>
    </Margin>
  );
};
