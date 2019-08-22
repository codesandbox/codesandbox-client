import React from 'react';
import { inject, observer } from 'app/componentConnectors';
import PricingInfo from './PricingInfo';
import PricingChoice from './PricingChoice';
import Badge from './Badge';
import { Container, Details } from './elements';

const PricingModal = ({ store }) => {
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

export default inject('store')(observer(PricingModal));
