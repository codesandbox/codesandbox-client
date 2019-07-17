import { observer } from 'mobx-react-lite';
import React from 'react';

import { useStore } from 'app/store';

import { ButtonContainer } from '../../../elements';

import { SubTitle } from '../elements';

import { ClaimSiteButton } from './ClaimSiteButton';
import { VisitSiteButton } from './VisitSiteButton';

export const Actions = observer(() => {
  const {
    deployment: { netlifyClaimUrl },
  } = useStore();

  return (
    <>
      <SubTitle>Actions</SubTitle>

      <ButtonContainer>
        <VisitSiteButton />

        {netlifyClaimUrl ? <ClaimSiteButton /> : null}
      </ButtonContainer>
    </>
  );
});
