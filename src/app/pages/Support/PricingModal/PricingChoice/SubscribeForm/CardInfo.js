import React from 'react';
import styled from 'styled-components';

import { StripeProvider, Elements } from 'react-stripe-elements';

import { STRIPE_API_KEY } from 'app/utils/config';

import CheckoutForm from './CheckoutForm';

const Container = styled.div`
  width: 300px;
  margin-top: 2rem;
  border-radius: 3px;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.8);
`;

type Props = {
  name: ?string,
  subscribe: (token: string) => void,
};

export default ({ name, subscribe }: Props) =>
  <Container>
    <StripeProvider apiKey={STRIPE_API_KEY}>
      <Elements>
        <CheckoutForm subscribe={subscribe} name={name} />
      </Elements>
    </StripeProvider>
  </Container>;
