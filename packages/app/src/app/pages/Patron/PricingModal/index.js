import { inject, observer } from 'mobx-react';
import React from 'react';

import Badge from './Badge';
import { Container, Details } from './elements';
import PricingChoice from './PricingChoice';
import PricingInfo from './PricingInfo';

const PricingModal = ({
  store: {
    isPatron,
    patron: { tier },
  },
}) => {
  const badge = `patron-${tier}`;

  return (
    <Container>
      <Badge subscribed={isPatron} badge={badge} />

      <Details>
        <PricingInfo />

        <PricingChoice badge={badge} />
      </Details>
    </Container>
  );
};

export default inject('store')(observer(PricingModal));
