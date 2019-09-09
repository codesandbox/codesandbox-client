import React from 'react';
import { observer, inject } from 'app/componentConnectors';
import PricingInfo from './PricingInfo';
import { PricingChoice } from './PricingChoice';
import { Badge } from './Badge';
import { Container, Details } from './elements';

const PricingModalComponent = ({ store }) => {
  const badge = `patron-${store.patron.tier}`;

  return (
    <Container>
      <Badge subscribed={store.isPatron} badge={badge} />
      <Details>
        <PricingInfo />
        <PricingChoice badge={badge} />
      </Details>
    </Container>
  );
};

export const PricingModal = inject('store')(observer(PricingModalComponent));
