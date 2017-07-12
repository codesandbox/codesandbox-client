import React from 'react';
import styled from 'styled-components';

import { StripeProvider, Elements, CardElement } from 'react-stripe-elements';

import { STRIPE_API_KEY } from 'app/utils/config';
import Input from '../../../../components/Input';

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
  border-radius: 4px;
`;

const NameInput = styled(Input)`
  width: 100%;
  font-size: .875rem;
  padding: .5rem;
  margin-top: 0.25rem;
  margin-bottom: .5rem;
  height: 32.8px;
`

const Label = styled.label`
  color: rgba(255, 255, 255, 0.5);
  font-size: .875rem;
`;

type Props = {
  name: ?string
};

export default class CardInfo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name || ''
    }
  }
  props: Props;

  render() {
    return (
      <Container>
        <StripeProvider apiKey={STRIPE_API_KEY}>
          <Elements>
            <div>
              <Label>Full Name</Label>
              <div>
                <NameInput

                />
              </div>

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
