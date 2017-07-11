import React from 'react';
import styled from 'styled-components';

import PricingInfo from './PricingInfo';
import PricingChoice from './PricingChoice';

const Container = styled.div`
  margin: 4rem auto;
  width: 100%;
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

export default () =>
  <Container>
    <Details>
      <PricingInfo />
      <PricingChoice />
    </Details>
  </Container>;
