import React from 'react';
import { observer } from 'app/componentConnectors';
import { useStore } from 'app/store';
import PricingInfo from './PricingInfo';
import { PricingChoice } from './PricingChoice';
import { Badge } from './Badge';
import { Container, Details } from './elements';

const PricingModalComponent = () => {
  const store = useStore();
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

export const PricingModal = observer(PricingModalComponent);
