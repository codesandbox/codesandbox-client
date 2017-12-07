import React from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';

import PricingInfo from './PricingInfo';
import PricingChoice from './PricingChoice';
import Badge from './Badge';

const Container = styled.div`
  margin: 8rem auto;
  width: 940px;
  padding: 1rem;
  background-color: ${props => props.theme.background};

  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
`;

const Details = styled.div`
  display: flex;
  flex-direction: row;

  margin-top: 6rem;

  > div {
    flex: 1;
  }
`;

export default inject('store')(({ store }) => {
  const badge = `patron-${store.patron.tier}`;

  return (
    <Container>
      <Badge subscribed={store.subscribed} badge={badge} />
      <Details>
        <PricingInfo />
        <PricingChoice badge={badge} />
      </Details>
    </Container>
  );
});
