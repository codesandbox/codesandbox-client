import React, { ComponentProps, FunctionComponent, useEffect } from 'react';

import { SubscribeForm } from 'app/components/SubscribeForm';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';

import { Text, Element, Stack } from '@codesandbox/components';
import {
  AmexIcon,
  MasterCardIcon,
  VisaIcon,
  BlankIcon,
  DiscoverIcon,
} from './Icons';

const Icon = (name: string) => {
  let icon;
  switch (name) {
    case 'MasterCard':
      icon = MasterCardIcon;
      break;
    case 'American Express':
      icon = AmexIcon;
      break;
    case 'Discover':
      icon = DiscoverIcon;
      break;
    case 'Visa':
      icon = VisaIcon;
      break;

    default:
      icon = BlankIcon;
  }

  return icon;
};

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
        <Stack gap={4}>
          <Element>
            <Text block size={3} marginTop={4} marginBottom={4}>
              Update card info
            </Text>
            <SubscribeForm
              buttonName="Update"
              loadingText="Updating Card Info..."
              name={name}
              subscribe={updatePaymentDetails}
            />
          </Element>
          <Element>
            <Text block size={3} marginTop={4} marginBottom={2}>
              Current card
            </Text>
            <Stack align="flex-start" paddingY={4}>
              <Element
                paddingRight={2}
                marginTop={1}
                css={css({
                  svg: {
                    height: 16,
                    width: 'auto',
                  },
                })}
              >
                {Icon(brand)()}
              </Element>
              <Element>
                <Element>
                  <Text weight="bold" size={3}>
                    {brand}
                  </Text>{' '}
                  <Text variant="muted">ending in </Text>
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
            </Stack>
          </Element>
        </Stack>
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
