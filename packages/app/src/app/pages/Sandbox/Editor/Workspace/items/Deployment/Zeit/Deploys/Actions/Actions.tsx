import { observer } from 'mobx-react-lite';
import React from 'react';

import { useStore } from 'app/store';

import { ButtonContainer } from '../../../elements';

import { AliasDeploymentButton } from './AliasDeploymentButton';
import { DeleteDeploymentButton } from './DeleteDeploymentButton';
import { VisitDeploymentButton } from './VisitDeploymentButton';

export const Actions = observer(({ deploy }) => {
  const {
    deployment: { hasAlias },
  } = useStore();

  return (
    <ButtonContainer>
      <VisitDeploymentButton url={deploy.url} />

      <DeleteDeploymentButton id={deploy.uid} />

      {hasAlias && deploy.state === 'READY' ? (
        <AliasDeploymentButton deploy={deploy} />
      ) : null}
    </ButtonContainer>
  );
});
