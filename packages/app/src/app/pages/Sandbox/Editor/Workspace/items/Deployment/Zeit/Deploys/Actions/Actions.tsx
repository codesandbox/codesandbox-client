import { inject, hooksObserver } from 'app/componentConnectors';
import React from 'react';

import { ButtonContainer } from '../../../elements';

import { AliasDeploymentButton } from './AliasDeploymentButton';
import { DeleteDeploymentButton } from './DeleteDeploymentButton';
import { VisitDeploymentButton } from './VisitDeploymentButton';
import { Deploy } from './types';

type Props = {
  deploy: Deploy;
  store: any;
};
export const Actions = inject('store')(
  hooksObserver(({ deploy, store: { deployment: { hasAlias } } }: Props) => (
    <ButtonContainer>
      <VisitDeploymentButton url={deploy.url} />

      <DeleteDeploymentButton id={deploy.uid} />

      {hasAlias && deploy.state === 'READY' ? (
        <AliasDeploymentButton deploy={deploy} />
      ) : null}
    </ButtonContainer>
  ))
);
