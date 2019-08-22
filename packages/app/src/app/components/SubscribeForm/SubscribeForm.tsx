import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { STRIPE_API_KEY } from '@codesandbox/common/lib/utils/config';
import CheckoutForm from './CheckoutForm';
import { Container } from './elements';

interface ISubscribeFormProps {
  name: string;
  subscribe: (params: { token: string; coupon: string }) => void;
  loadingText?: string;
  buttonName?: string;
  isLoading?: boolean;
  error?: string;
  hasCoupon?: boolean;
}

export const SubscribeForm: React.FC<ISubscribeFormProps> = ({
  name,
  subscribe,
  loadingText = 'Creating Subscription...',
  buttonName = 'Subscribe',
  isLoading = false,
  error,
  hasCoupon,
}) => (
  <Container>
    <StripeProvider apiKey={STRIPE_API_KEY}>
      <Elements>
        <CheckoutForm
          buttonName={buttonName}
          loadingText={loadingText}
          subscribe={subscribe}
          name={name}
          isLoading={isLoading}
          error={error}
          hasCoupon={hasCoupon}
        />
      </Elements>
    </StripeProvider>
  </Container>
);
