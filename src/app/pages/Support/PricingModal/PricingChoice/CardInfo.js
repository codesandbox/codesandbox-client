import React from 'react';
import styled from 'styled-components';

import { StripeProvider, Elements, CardElement } from 'react-stripe-elements';

import { STRIPE_API_KEY } from 'app/utils/config';

const Container = styled.div`
  width: 300px;
  margin-top: 2rem;
  border-radius: 3px;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.8);
`;

const CardContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 0.5rem;
  margin-top: 0.25rem;
  border-radius: 2px;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.5);
  font-size: .875rem;
`;

export default class CardInfo extends React.PureComponent {
  render() {
    return (
      <Container>
        <StripeProvider apiKey={STRIPE_API_KEY}>
          <Elements>
            <div>
              <Label>Card</Label>
              <CardContainer>
                <CardElement
                  style={{ base: { color: 'white', fontWeight: 300 } }}
                />
              </CardContainer>
            </div>
          </Elements>
        </StripeProvider>
      </Container>
    );
  }
}
