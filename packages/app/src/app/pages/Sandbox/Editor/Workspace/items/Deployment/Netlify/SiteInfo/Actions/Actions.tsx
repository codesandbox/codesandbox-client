import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { ButtonContainer } from '../../../elements';

import { SubTitle } from '../elements';

import { ClaimSiteButton } from './ClaimSiteButton';
import { VisitSiteButton } from './VisitSiteButton';

export const Actions: FunctionComponent = () => {
  const {
    state: {
      deployment: { netlifyClaimUrl },
    },
  } = useOvermind();

  return (
    <>
      <SubTitle>Actions</SubTitle>

      <ButtonContainer>
        <VisitSiteButton />

        {netlifyClaimUrl ? <ClaimSiteButton /> : null}
      </ButtonContainer>
    </>
  );
};
