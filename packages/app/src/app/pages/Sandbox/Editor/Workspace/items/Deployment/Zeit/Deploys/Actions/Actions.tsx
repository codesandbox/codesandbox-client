import {
  ZeitDeployment,
  ZeitDeploymentState,
} from '@codesandbox/common/lib/types';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { ButtonContainer } from '../../../elements';

import { AliasDeploymentButton } from './AliasDeploymentButton';
import { DeleteDeploymentButton } from './DeleteDeploymentButton';
import { VisitDeploymentButton } from './VisitDeploymentButton';

type Props = {
  deploy: ZeitDeployment;
};
export const Actions: FunctionComponent<Props> = ({ deploy }) => {
  const {
    state: {
      deployment: { hasAlias },
    },
  } = useOvermind();

  return (
    <ButtonContainer>
      <VisitDeploymentButton url={deploy.url} />

      <DeleteDeploymentButton id={deploy.uid} />

      {hasAlias && deploy.state === ZeitDeploymentState.READY ? (
        <AliasDeploymentButton deploy={deploy} />
      ) : null}
    </ButtonContainer>
  );
};
