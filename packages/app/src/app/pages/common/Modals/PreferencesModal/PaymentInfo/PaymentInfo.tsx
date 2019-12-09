import React, { useEffect } from 'react';
import { SubscribeForm } from 'app/components/SubscribeForm';
import { useOvermind } from 'app/overmind';
import { Card } from './Card';
import { Title, Subheading } from '../elements';
import { Container, CustomSubHeading } from './elements';

export const PaymentInfo: React.FunctionComponent = () => {
  const {
    state: {
      preferences: {
        paymentDetailError,
        paymentDetails: paymentDetailsFromHooks,
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

  const updatePaymentDetails = ({ token }) => {
    paymentDetailsUpdated({ token });
  };

  const paymentDetails = () => {
    const { last4, name, brand } = paymentDetailsFromHooks;
    if (paymentDetailError)
      return <div>An error occurred: {paymentDetailError}</div>;

    return (
      <div>
        <Subheading>Current card</Subheading>
        <Card last4={last4} name={name} brand={brand} />

        <CustomSubHeading>Update card info</CustomSubHeading>
        <SubscribeForm
          buttonName="Update"
          loadingText="Updating Card Info..."
          name={name}
          subscribe={updatePaymentDetails}
        />
      </div>
    );
  };

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
