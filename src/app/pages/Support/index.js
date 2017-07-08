import React from 'react';
import styled from 'styled-components';

import Title from 'app/components/text/Title';
import MaxWidth from 'app/components/flex/MaxWidth';
import Margin from 'app/components/spacing/Margin';

import Navigation from 'app/containers/Navigation';

import { StripeProvider, CardElement, Elements } from 'react-stripe-elements';

const Content = styled.div`
  margin-top: 5%;
  text-align: left;
  color: white;
`;

export default class Support extends React.PureComponent {
  render() {
    document.title = 'Support - CodeSandbox';
    return (
      <MaxWidth>
        <Margin vertical={1.5} horizontal={1.5}>
          <Navigation title="Support" />
          <Content>
            <MaxWidth width={1024}>
              <Title>Pricing</Title>
              <StripeProvider apiKey="pk_test_0HgnQIkQJCECIFCQkafGQ5gA">
                <div>
                  <Elements>
                    <CardElement />
                  </Elements>
                </div>
              </StripeProvider>
            </MaxWidth>
          </Content>
        </Margin>
      </MaxWidth>
    );
  }
}
