import React, { ComponentProps, FunctionComponent, useEffect } from 'react';

import { SubscribeForm } from 'app/components/SubscribeForm';
import { useOvermind } from 'app/overmind';

import { Text, Element } from '@codesandbox/components';

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
    const { brand, last4, name } = paymentDetails || {};
    if (isLoadingPaymentDetails) {
      return (
        <Text size={3} align="center" marginTop={6}>
          Loading payment details...
        </Text>
      );
    }

    if (paymentDetailError) {
      return (
        <Text size={3} align="center" marginTop={6}>
          An error occurred: {paymentDetailError}
        </Text>
      );
    }

    return (
      <>
        <Text block size={4} marginTop={4} marginBottom={2}>
          Current card
        </Text>
        <Element padding={4}>
          <Element>
            <Text weight="bold" size={3}>
              {brand}
            </Text>{' '}
            <Text variant="muted">ending in ****</Text>
            <Text weight="bold" size={3}>
              {last4}
            </Text>
          </Element>
          <Element>
            <Text weight="bold" size={3}>
              {name}
            </Text>
          </Element>
        </Element>
        <Text block size={4} marginTop={4} marginBottom={4}>
          Update card info
        </Text>
        <SubscribeForm
          buttonName="Update"
          loadingText="Updating Card Info..."
          name={name}
          subscribe={updatePaymentDetails}
        />
      </>
    );
  };

  return (
    <Element>
      <Text size={4} marginBottom={6} block variant="muted" weight="bold">
        Payment Info
      </Text>
      <Body />
    </Element>
  );
};
