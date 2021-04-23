import { Element, Stack, Text } from '@codesandbox/components';
import React, { FunctionComponent, useEffect } from 'react';

import { SubscribeForm } from 'app/components/SubscribeForm';
import { useAppState, useActions } from 'app/overmind';

import { Card } from './Card';

const Body: FunctionComponent = () => {
  const { paymentDetailsUpdated } = useActions().preferences;
  const {
    isLoadingPaymentDetails,
    paymentDetailError,
    paymentDetails,
  } = useAppState().preferences;

  const { name } = paymentDetails || {};

  if (isLoadingPaymentDetails) {
    return (
      <Text align="center" marginTop={6} size={3}>
        Loading payment details...
      </Text>
    );
  }

  if (paymentDetailError) {
    return (
      <Text align="center" marginTop={6} size={3}>
        {`An error occurred: ${paymentDetailError}`}
      </Text>
    );
  }

  return (
    <Stack gap={4}>
      <Element>
        <Text block marginBottom={4} marginTop={4} size={3}>
          Update card info
        </Text>

        <SubscribeForm
          buttonName="Update"
          loadingText="Updating Card Info..."
          name={name}
          subscribe={({ token }) => paymentDetailsUpdated(token)}
        />
      </Element>

      <Element>
        <Text block marginBottom={2} marginTop={4} size={3}>
          Current card
        </Text>

        <Card />
      </Element>
    </Stack>
  );
};

export const PaymentInfo: FunctionComponent = () => {
  const { paymentDetailsRequested } = useActions().preferences;

  useEffect(() => {
    paymentDetailsRequested();
  }, [paymentDetailsRequested]);

  return (
    <Element>
      <Text block marginBottom={6} size={4} weight="bold">
        Payment Info
      </Text>

      <Body />
    </Element>
  );
};
