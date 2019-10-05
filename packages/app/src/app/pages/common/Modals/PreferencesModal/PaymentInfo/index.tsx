import React, { FunctionComponent, useEffect, useCallback } from 'react';
import { useOvermind } from 'app/overmind';
import { SubscribeForm } from 'app/components/SubscribeForm';
import { Card } from './Card';
import { Title, Subheading } from '../elements';
import { Container } from './elements';

export const PaymentInfo: FunctionComponent = () => {
  const {
    state: {
      preferences: {
        paymentDetailError,
        paymentDetails: { last4, name, brand },
        isLoadingPaymentDetails,
      },
    },
    actions: {
      preferences: { paymentDetailsRequested, paymentDetailsUpdated },
    },
  } = useOvermind();

  useEffect(() => {
    paymentDetailsRequested();
  }, [paymentDetailsRequested]);

  const updatePaymentDetails = useCallback(
    ({ token }) => {
      paymentDetailsUpdated({ token });
    },
    [paymentDetailsUpdated]
  );

  const paymentDetails = useCallback(() => {
    if (paymentDetailError)
      return <div>An error occurred: {paymentDetailError}</div>;

    return (
      <div>
        <Subheading>Current card</Subheading>
        <Card last4={last4} name={name} brand={brand} />

        <Subheading style={{ marginTop: '2rem' }}>Update card info</Subheading>
        <SubscribeForm
          buttonName="Update"
          loadingText="Updating Card Info..."
          name={name}
          subscribe={updatePaymentDetails}
        />
      </div>
    );
  }, [paymentDetailError, last4, name, brand, updatePaymentDetails]);

  return (
    <Container>
      <Title>Payment Info</Title>
      {isLoadingPaymentDetails ? (
        <div>Loading payment details...</div>
      ) : (
        paymentDetails()
      )}
    </Container>
  );
};
