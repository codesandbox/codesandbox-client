import React from 'react';
import Helmet from 'react-helmet';
import { observer, inject } from 'app/componentConnectors';
import PricingInfo from './PricingInfo';
import { PricingChoice } from './PricingChoice';
import { Badge } from './Badge';
import { Container, Details } from './elements';

const PricingModalComponent = ({ store }) => {
  const badge = `patron-${store.patron.tier}`;

  return (
    <Container>
      <Helmet>
        <script async rel="prefetch" src="https://js.stripe.com/v3/" />
      </Helmet>
      <Badge subscribed={store.isPatron} badge={badge} />
      <Details>
        <PricingInfo />
        <PricingChoice badge={badge} />
      </Details>
    </Container>
  );
};

export const PricingModal = inject('store')(observer(PricingModalComponent));
