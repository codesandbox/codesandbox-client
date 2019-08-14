import { inject, hooksObserver } from 'app/componentConnectors';
import React from 'react';

import { ButtonContainer } from '../../../elements';

import { SubTitle } from '../elements';

import { ClaimSiteButton } from './ClaimSiteButton';
import { VisitSiteButton } from './VisitSiteButton';

export const Actions = inject('store')(
  hooksObserver(({ store: { deployment: { netlifyClaimUrl } } }) => (
    <>
      <SubTitle>Actions</SubTitle>

      <ButtonContainer>
        <VisitSiteButton />

        {netlifyClaimUrl ? <ClaimSiteButton /> : null}
      </ButtonContainer>
    </>
  ))
);
