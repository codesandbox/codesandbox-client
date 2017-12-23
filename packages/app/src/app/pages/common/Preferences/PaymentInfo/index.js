import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import SubscribeForm from 'app/components/user/SubscribeForm';

import Card from './Card';
import Title from '../MenuTitle';
import { Subheading } from '../styles';

const Container = styled.div`
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
`;

export default inject('store', 'signals')(
  observer(
    class PaymentInfo extends React.Component {
      componentDidMount() {
        this.props.signals.editor.preferences.paymentDetailsRequested();
      }

      updatePaymentDetails = token => {
        this.props.signals.editor.preferences.paymentDetailsUpdated({ token });
      };

      paymentDetails = () => {
        const {
          paymentDetails,
          paymentDetailError,
        } = this.props.store.editor.preferences;

        if (paymentDetailError)
          return <div>An error occurred: {paymentDetailError}</div>;

        return (
          <div>
            <Subheading>Current card</Subheading>
            <Card
              last4={paymentDetails.last4}
              name={paymentDetails.name}
              brand={paymentDetails.brand}
            />

            <Subheading style={{ marginTop: '2rem' }}>
              Update card info
            </Subheading>
            <SubscribeForm
              buttonName="Update"
              loadingText="Updating Card Info..."
              name={paymentDetails.name}
              subscribe={this.updatePaymentDetails}
            />
          </div>
        );
      };

      render() {
        const { isLoadingPaymentDetails } = this.props.store.editor.preferences;
        return (
          <Container>
            <Title>Payment Info</Title>
            {isLoadingPaymentDetails ? (
              <div>Loading payment details...</div>
            ) : (
              this.paymentDetails()
            )}
          </Container>
        );
      }
    }
  )
);
