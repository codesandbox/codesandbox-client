import React from 'react';
import { useOvermind } from 'app/overmind';
import PricingInfo from './PricingInfo';
import { PricingChoice } from './PricingChoice';
import { Badge } from './Badge';
import { Container, Details } from './elements';

export const PricingModal = () => {
  const { state } = useOvermind();

  return (
    <Container>
      <Badge subscribed={state.isPatron} badge={state.patron.badge} />
      <Details>
        <PricingInfo />
        <PricingChoice badge={state.patron.badge} />
      </Details>
    </Container>
  );
};
