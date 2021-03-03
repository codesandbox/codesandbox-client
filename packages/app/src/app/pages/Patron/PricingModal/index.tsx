import React from 'react';
import { useAppState } from 'app/overmind';
import { PricingInfo } from './PricingInfo';
import { PricingChoice } from './PricingChoice';
import { Badge } from './Badge';
import { Container, Details } from './elements';

export const PricingModal = () => {
  const { isPatron, patron } = useAppState();

  return (
    <Container>
      <Badge subscribed={isPatron} badge={patron.badge} />
      <Details>
        <PricingInfo />
        <PricingChoice badge={patron.badge} />
      </Details>
    </Container>
  );
};
