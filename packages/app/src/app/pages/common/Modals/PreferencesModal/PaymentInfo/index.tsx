import React, { ComponentProps, FunctionComponent, useEffect } from 'react';

import { SubscribeForm } from 'app/components/SubscribeForm';
import { useOvermind } from 'app/overmind';

import { Title, Subheading } from '../elements';

import { Card } from './Card';
import { Container } from './elements';

export const PaymentInfo: FunctionComponent = () => {
  const {
    actions: {
      preferences: { paymentDetailsRequested, paymentDetailsUpdated },
    },
    state: {
      preferences: {
        isLoadingPaymentDetails,
        paymentDetailError,
        paymentDetails,
      },
    },
  } = useOvermind();

  useEffect(() => {
    paymentDetailsRequested();
  }, [paymentDetailsRequested]);

  const updatePaymentDetails: ComponentProps<
    typeof SubscribeForm
  >['subscribe'] = ({ token }) => paymentDetailsUpdated(token);

  const Body = () => {
    if (isLoadingPaymentDetails) {
      return <div>Loading payment details...</div>;
    }

    if (paymentDetailError) {
      return <div>An error occurred: {paymentDetailError}</div>;
    }

    return (
      <div>
        <Subheading>Current card</Subheading>

        <Card brand={paymentDetails.brand} last4={paymentDetails.last4} name={paymentDetails.name} />

        <Subheading style={{ marginTop: '2rem' }}>Update card info</Subheading>

        <SubscribeForm
          buttonName="Update"
          loadingText="Updating Card Info..."
          name={paymentDetails.name}
          subscribe={updatePaymentDetails}
        />
      </div>
    );
  };

  return (
    <Container>
      <Title>Payment Info</Title>

      <Body />
    </Container>
  );
};
