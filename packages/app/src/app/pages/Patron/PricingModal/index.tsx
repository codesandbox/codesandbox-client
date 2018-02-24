import * as React from 'react';
import { connect } from 'app/fluent'

import PricingInfo from './PricingInfo';
import PricingChoice from './PricingChoice';
import Badge from './Badge';

import { Container, Details } from './elements';

export default connect()
  .with(({ state }) => ({
    isPatron: state.isPatron,
    tier: state.patron.tier
  }))
  .to(
    function PricingModal({ isPatron, tier }) {
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
    }
  )
